import { d } from '../dice/dice';
import { type RandomTable } from '../domain/random-table';
import { randomOptionEntry, type HexesDetailed } from './data';
import { neighborsOfPatchHex } from './hex-grid';

type FactionType = 'castle' | 'city' | 'tower' | 'abbey' | 'lair' | 'mixed';

type FactionSource = {
  hex: number;
  type: Exclude<FactionType, 'mixed'>;
  inhabitant?: string;
};

type FactionRelationship = {
  faction: number;
  roll: number;
  relation: string;
};

type FactionEvent = {
  when: string;
  nature: string;
};

type Faction = {
  number: number;
  type: FactionType;
  sources: FactionSource[];
  label: string;
  hexes: number[];
  relationships: FactionRelationship[];
  event: FactionEvent | null;
};

type FactionOptions = {
  neighbors?: (hex: number) => number[];
  lairInhabitants?: { [hex: number]: string };
  isLairFaction?: (inhabitant: string) => boolean;
};

type FactionResult = {
  factions: Faction[];
  hexFactions: { [hex: number]: number[] };
  contestedHexes: number[];
};

type FactionRolls = number[];

const tableFactionRelationship: RandomTable = {
  id: 140,
  title: 'Faction Relationship',
  dice: '2d6',
  options: {
    2: 'Open war',
    3: 'Hostility',
    4: 'Hostility',
    5: 'Hostility',
    6: 'Indifference',
    7: 'Indifference',
    8: 'Indifference',
    9: 'Peace/Trade',
    10: 'Peace/Trade',
    11: 'Peace/Trade',
    12: 'Alliance',
  },
};

const tableFactionEventWhen: RandomTable = {
  id: 141,
  title: 'Faction Event When',
  dice: '1d6',
  options: {
    1: 'Ended earlier',
    2: 'Is happening now',
    3: 'Is happening now',
    4: 'Is happening now',
    5: 'Will take place in the future',
    6: 'Will take place in the future',
  },
};

const tableFactionEventNature: RandomTable = {
  id: 142,
  title: 'Faction Event Nature',
  dice: '1d12',
  options: {
    1: 'Assassination',
    2: 'Celebration',
    3: 'Curse',
    4: 'Holy quest',
    5: 'Hostage situation',
    6: 'Mysterious ally',
    7: 'Negotiations with another faction',
    8: 'New headquarters',
    9: 'New leader',
    10: 'Plague',
    11: 'Treaty signed with another faction',
    12: 'War',
  },
};

// Monsters that can organise themselves into a faction. The book leaves the
// exact list to the bestiary, so this is the subset of the five biome tables
// that clearly has intelligent inhabitants.
const intelligentLairInhabitants = new Set(
  [
    'Ogres',
    'Gnolls',
    'Orcs',
    'Goblins',
    'Bandits',
    'Berserkers',
    'Worgs',
    'Werewolves',
    'Moth-men',
    'Mushroom-men',
    'Frog-men',
    'Trolls',
    'Lizard-men',
    'Snake-men',
    'Ents',
    'Kobolds',
    'Elves',
    'Dryads',
    'Giants',
    'Dwarves',
    'Vampires',
    'Manticores',
    'Beastmen',
  ].map((inhabitant) => inhabitant.toLowerCase())
);

function isIntelligentLair(inhabitant: string): boolean {
  return intelligentLairInhabitants.has(inhabitant.trim().toLowerCase());
}

function calcFactionRelationship(
  rollFn: (faces: number) => number = d
): { roll: number; relation: string; } {
  const { roll, result } = randomOptionEntry(tableFactionRelationship, rollFn);
  return { roll, relation: result };
}

function calcFactionEvent(
  rollFn: (faces: number) => number = d
): FactionEvent | null {
  if (rollFn(6) !== 1) {
    return null;
  }
  const when = randomOptionEntry(tableFactionEventWhen, rollFn).result;
  const nature = randomOptionEntry(tableFactionEventNature, rollFn).result;
  return { when, nature };
}

function featureAt(features: HexesDetailed, hex: number): string | null {
  const details = features[hex];
  if (!details || details.length === 0) {
    return null;
  }
  return details[details.length - 1];
}

function sourceLabel(source: FactionSource): string {
  switch (source.type) {
    case 'castle':
      return `Castle ${source.hex}`;
    case 'city':
      return `City ${source.hex}`;
    case 'tower':
      return `Tower ${source.hex}`;
    case 'abbey':
      return `Abbey ${source.hex}`;
    case 'lair':
      return `${source.inhabitant ?? 'Lair'} lair ${source.hex}`;
  }
}

type FactionCandidate = {
  index: number;
  sources: FactionSource[];
  hexes: Set<number>;
};

function createUnionFind(size: number) {
  const parent = Array.from({ length: size }, (_, index) => index);

  function find(value: number): number {
    let root = value;
    while (parent[root] !== root) {
      root = parent[root];
    }
    while (parent[value] !== value) {
      const next = parent[value];
      parent[value] = root;
      value = next;
    }
    return root;
  }

  function union(a: number, b: number) {
    const rootA = find(a);
    const rootB = find(b);
    if (rootA !== rootB) {
      parent[rootB] = rootA;
    }
  }

  return { find, union };
}

function sharesAnyHex(a: Set<number>, b: Set<number>): boolean {
  for (const hex of a) {
    if (b.has(hex)) {
      return true;
    }
  }
  return false;
}

function factionsTouch(
  a: Faction,
  b: Faction,
  neighbors: (hex: number) => number[]
): boolean {
  const bHexes = new Set(b.hexes);
  return a.hexes.some(
    (hex) => bHexes.has(hex) || neighbors(hex).some((neighbor) => bHexes.has(neighbor))
  );
}

function calcFactions(
  features: HexesDetailed,
  options: FactionOptions = {},
  rollFn: (faces: number) => number = d
): FactionResult {
  const neighbors = options.neighbors ?? neighborsOfPatchHex;
  const lairInhabitants = options.lairInhabitants ?? {};
  const isLairFaction = options.isLairFaction ?? isIntelligentLair;
  const knownHexes = Object.keys(features)
    .map(Number)
    .sort((a, b) => a - b);
  const known = new Set(knownHexes);

  const candidates: FactionCandidate[] = [];
  const bigCandidates: FactionCandidate[] = [];
  const smallCandidates: FactionCandidate[] = [];

  function addCandidate(sources: FactionSource[], hexes: Set<number>): FactionCandidate {
    const candidate = { index: candidates.length, sources, hexes };
    candidates.push(candidate);
    return candidate;
  }

  // Big settlements (castles and cities) claim the hex they are on and its six
  // neighbours.
  for (const hex of knownHexes) {
    const feature = featureAt(features, hex);
    if (feature !== 'Castle' && feature !== 'City') {
      continue;
    }
    const hexes = new Set<number>([hex]);
    for (const neighbor of neighbors(hex)) {
      if (known.has(neighbor)) {
        hexes.add(neighbor);
      }
    }
    bigCandidates.push(
      addCandidate([{ hex, type: feature === 'Castle' ? 'castle' : 'city' }], hexes)
    );
  }

  // Small settlements and lairs start with the hex they are on, then add their
  // special extensions.
  for (const hex of knownHexes) {
    const feature = featureAt(features, hex);

    if (feature === 'Tower') {
      const hexes = new Set<number>([hex]);
      for (const neighbor of neighbors(hex)) {
        if (!known.has(neighbor)) {
          continue;
        }
        const neighborFeature = featureAt(features, neighbor);
        const canBeEnslaved =
          neighborFeature === 'Hamlet' ||
          neighborFeature === 'Village' ||
          neighborFeature === 'Lair' ||
          neighborFeature === 'Dungeon';
        if (canBeEnslaved && rollFn(6) === 1) {
          hexes.add(neighbor);
        }
      }
      smallCandidates.push(addCandidate([{ hex, type: 'tower' }], hexes));
    } else if (feature === 'Abbey') {
      const hexes = new Set<number>([hex]);
      for (const neighbor of neighbors(hex)) {
        if (!known.has(neighbor)) {
          continue;
        }
        const neighborFeature = featureAt(features, neighbor);
        if (neighborFeature === 'Hamlet' || neighborFeature === 'Village') {
          hexes.add(neighbor);
        }
      }
      smallCandidates.push(addCandidate([{ hex, type: 'abbey' }], hexes));
    } else if (feature === 'Lair') {
      const inhabitant = lairInhabitants[hex];
      if (!inhabitant || !isLairFaction(inhabitant)) {
        continue;
      }
      smallCandidates.push(
        addCandidate([{ hex, type: 'lair', inhabitant }], new Set<number>([hex]))
      );
    }
  }

  const unionFind = createUnionFind(candidates.length);

  // Big domains that share hexes can belong to the same faction.
  for (let i = 0; i < bigCandidates.length; i++) {
    for (let j = i + 1; j < bigCandidates.length; j++) {
      const a = bigCandidates[i];
      const b = bigCandidates[j];
      if (!sharesAnyHex(a.hexes, b.hexes)) {
        continue;
      }
      if (unionFind.find(a.index) === unionFind.find(b.index)) {
        continue;
      }
      if (rollFn(6) <= 3) {
        unionFind.union(a.index, b.index);
      }
    }
  }

  // Adjacent lairs with the same creature can belong to the same faction.
  for (let i = 0; i < smallCandidates.length; i++) {
    for (let j = i + 1; j < smallCandidates.length; j++) {
      const a = smallCandidates[i];
      const b = smallCandidates[j];
      const sourceA = a.sources[0];
      const sourceB = b.sources[0];
      if (sourceA.type !== 'lair' || sourceB.type !== 'lair') {
        continue;
      }
      if (!sourceA.inhabitant || sourceA.inhabitant !== sourceB.inhabitant) {
        continue;
      }
      if (!neighbors(sourceA.hex).includes(sourceB.hex)) {
        continue;
      }
      if (unionFind.find(a.index) === unionFind.find(b.index)) {
        continue;
      }
      if (rollFn(6) <= 3) {
        unionFind.union(a.index, b.index);
      }
    }
  }

  const groups = new Map<number, FactionCandidate[]>();
  for (const candidate of candidates) {
    const root = unionFind.find(candidate.index);
    const group = groups.get(root) ?? [];
    group.push(candidate);
    groups.set(root, group);
  }

  const grouped = Array.from(groups.values())
    .map((group) => {
      const sources = group
        .flatMap((candidate) => candidate.sources)
        .sort((a, b) => a.hex - b.hex);
      const hexes = Array.from(
        new Set(group.flatMap((candidate) => Array.from(candidate.hexes)))
      ).sort((a, b) => a - b);
      const types = Array.from(new Set(sources.map((source) => source.type)));
      return {
        type: (types.length === 1 ? types[0] : 'mixed') as FactionType,
        sources,
        hexes,
      };
    })
    .sort((a, b) => a.sources[0].hex - b.sources[0].hex);

  const factions: Faction[] = grouped.map((group, index) => ({
    number: index + 1,
    type: group.type,
    sources: group.sources,
    label: group.sources.map(sourceLabel).join(' + '),
    hexes: group.hexes,
    relationships: [],
    event: null,
  }));

  const hexFactions: { [hex: number]: number[] } = {};
  for (const hex of knownHexes) {
    hexFactions[hex] = [];
  }
  for (const faction of factions) {
    for (const hex of faction.hexes) {
      hexFactions[hex].push(faction.number);
    }
  }
  for (const hex of knownHexes) {
    hexFactions[hex].sort((a, b) => a - b);
  }
  const contestedHexes = knownHexes.filter((hex) => hexFactions[hex].length > 1);

  for (let i = 0; i < factions.length; i++) {
    for (let j = i + 1; j < factions.length; j++) {
      const a = factions[i];
      const b = factions[j];
      if (!factionsTouch(a, b, neighbors)) {
        continue;
      }
      const relationship = calcFactionRelationship(rollFn);
      a.relationships.push({ faction: b.number, ...relationship });
      b.relationships.push({ faction: a.number, ...relationship });
    }
  }

  for (const faction of factions) {
    faction.event = calcFactionEvent(rollFn);
  }

  return { factions, hexFactions, contestedHexes };
}

function calcFactionsWithRolls(
  features: HexesDetailed,
  options: FactionOptions = {},
  rollFn: (faces: number) => number = d
): { result: FactionResult; rolls: FactionRolls } {
  const rolls: FactionRolls = [];
  const result = calcFactions(features, options, (faces) => {
    const roll = rollFn(faces);
    rolls.push(roll);
    return roll;
  });
  return { result, rolls };
}

function calcFactionsFromRolls(
  features: HexesDetailed,
  rolls: FactionRolls,
  options: FactionOptions = {}
): FactionResult {
  let index = 0;
  const result = calcFactions(features, options, (faces) => {
    const roll = rolls[index++];
    if (!Number.isInteger(roll) || roll < 1 || roll > faces) {
      throw new Error(`Invalid faction roll at position ${index}.`);
    }
    return roll;
  });
  if (index !== rolls.length) {
    throw new Error('Unexpected extra faction rolls.');
  }
  return result;
}

export {
  calcFactionEvent,
  calcFactionRelationship,
  calcFactions,
  calcFactionsFromRolls,
  calcFactionsWithRolls,
  isIntelligentLair,
  tableFactionEventNature,
  tableFactionEventWhen,
  tableFactionRelationship,
  type Faction,
  type FactionEvent,
  type FactionOptions,
  type FactionRolls,
  type FactionRelationship,
  type FactionResult,
  type FactionSource,
  type FactionType,
};
