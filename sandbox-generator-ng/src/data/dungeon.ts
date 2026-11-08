import { d } from '../dice/dice';
import { randomOptionEntry } from './data';
import {
  tableDungeonAreaNameNoun,
  tableDungeonAreaNamePrefix,
  tableDungeonAreaTheme,
  tableDungeonCamouflagedDoorAppearance,
  tableDungeonCamouflagedDoorClue,
  tableDungeonCorridorDoorSide,
  tableDungeonCorridorEnd,
  tableDungeonCorridorFeatures,
  tableDungeonCorridorLength,
  tableDungeonCrossSectionLinks,
  tableDungeonDemonDoorTask,
  tableDungeonDoorCount,
  tableDungeonDoorDestination,
  tableDungeonDoorType,
  tableDungeonEmptyRoom,
  tableDungeonFactionCount,
  tableDungeonFactionRelationship,
  tableDungeonLinkTarget,
  tableDungeonLinkTargetWithoutSameDepth,
  tableDungeonMagicDoorType,
  tableDungeonMonsterLevelByDepth,
  tableDungeonMonsterTypesByLevel,
  tableDungeonRoomDoorPosition,
  tableDungeonRoomShape,
  tableDungeonRoomSize,
  tableDungeonRoomType,
  tableDungeonSecretDoorForm,
  tableDungeonSecretDoorMechanism,
  tableDungeonSpecialRoom,
  tableDungeonSublevelLink,
  tableDungeonTrap,
  tableDungeonVisibleSecretDoorType,
} from './dungeon-tables';

type RollFunction = (faces: number) => number;
type DungeonDepth = 1 | 2 | 3 | 4 | 5 | 6;
type DungeonMonsterLevel = 1 | 2 | 3 | 4 | 5 | 6;
type DungeonRoomType = 'trap' | 'empty' | 'special' | 'monsters';

type DungeonOptions = {
  areaCount?: number;
  includeRoomShapes?: boolean;
  percentInLairByMonsterResult?: { [monsterResult: string]: number };
  rollFn?: RollFunction;
};

type DungeonMonsterResult = {
  level: number;
  roll: number;
  type: string;
};

type DungeonTableResult = {
  table: string;
  roll: number;
  result: string;
};

type DungeonFaction = {
  number: number;
  monster: DungeonMonsterResult;
  encounterChance: number;
};

type DungeonEncounter = {
  monster: DungeonMonsterResult;
  chance: number;
  faction: boolean;
};

type DungeonDoor = {
  position: string;
  destination: string;
  type: string;
  details: DungeonTableResult[] | null;
};

type DungeonRoom = {
  number: number;
  type: DungeonRoomType;
  detail: DungeonTableResult | null;
  treasureChance: number | null;
  treasureRoll: number | null;
  hasTreasure: boolean | null;
  size: string;
  length: number;
  width: number;
  shape: string | null;
  monster: DungeonMonsterResult | null;
  isLair: boolean | null;
  doors: DungeonDoor[];
};

type DungeonCorridor = {
  sections: {
    number: number;
    length: 6;
    features: string[];
  }[];
  end: string;
};

type DungeonLevel = {
  number: number;
  depth: DungeonDepth;
  sublevel: number;
  roomCount: number;
  factions: DungeonFaction[];
  wanderingMonsters: DungeonEncounter[];
  factionRelationships: {
    firstFaction: number;
    secondFaction: number;
    roll: number;
    relationship: string;
  }[];
  rooms: DungeonRoom[];
};

type DungeonArea = {
  number: number;
  name: {
    prefixRoll: number;
    nounRoll: number;
    result: string;
  };
  themeRoll: number;
  theme: string;
  levels: DungeonLevel[];
};

type DungeonLink = {
  fromArea: number;
  fromLevel: number;
  toArea: number;
  toLevel: number;
  type: 'vertical' | 'same-depth' | 'corridor' | 'secret';
};

type Dungeon = {
  areas: DungeonArea[];
  links: DungeonLink[];
};

type DungeonCorridorOptions = {
  hasDeeperLevel?: boolean;
  hasHigherLevel?: boolean;
  rollFn?: RollFunction;
};

function rollDice(count: number, faces: number, rollFn: RollFunction): number {
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += rollFn(faces);
  }
  return total;
}

function dungeonDepth(roll: number): DungeonDepth {
  return Math.min(Math.max(roll, 1), 6) as DungeonDepth;
}

function isDungeonMonsterLevel(level: number): level is DungeonMonsterLevel {
  return Number.isInteger(level) && level >= 1 && level <= 6;
}

function monsterLevelAtDepth(depth: DungeonDepth, rollFn: RollFunction): DungeonMonsterLevel {
  const result = randomOptionEntry(tableDungeonMonsterLevelByDepth[depth], rollFn);
  const level = Number(result.result);
  if (!isDungeonMonsterLevel(level)) {
    throw new Error(`Invalid monster level "${result.result}" for dungeon depth ${depth}.`);
  }
  return level;
}

function rollMonster(depth: DungeonDepth, rollFn: RollFunction): DungeonMonsterResult {
  const level = monsterLevelAtDepth(depth, rollFn);
  const monster = randomOptionEntry(tableDungeonMonsterTypesByLevel[level], rollFn);
  return {
    level,
    roll: monster.key,
    type: monster.result,
  };
}

function generateFactions(
  depth: DungeonDepth,
  rollFn: RollFunction,
): DungeonFaction[] {
  const countResult = randomOptionEntry(tableDungeonFactionCount, rollFn).result;
  const count = countResult === 'One' ? 1 : countResult === 'Two' ? 2 : 3;
  const chanceFaces = count === 1 ? 4 : count === 2 ? 3 : 2;
  return Array.from({ length: count }, (_, index) => ({
    number: index + 1,
    monster: rollMonster(depth, rollFn),
    encounterChance: rollFn(chanceFaces),
  }));
}

function generateWanderingMonsters(
  depth: DungeonDepth,
  factions: DungeonFaction[],
  rollFn: RollFunction,
): DungeonEncounter[] {
  const encounters: DungeonEncounter[] = factions.map((faction) => ({
    monster: faction.monster,
    chance: faction.encounterChance,
    faction: true,
  }));
  const remainingChance = 6 - encounters.reduce((total, entry) => total + entry.chance, 0);
  for (let i = 0; i < remainingChance; i++) {
    encounters.push({ monster: rollMonster(depth, rollFn), chance: 1, faction: false });
  }
  return encounters;
}

function generateFactionRelationships(
  factions: DungeonFaction[],
  rollFn: RollFunction,
): DungeonLevel['factionRelationships'] {
  const relationships: DungeonLevel['factionRelationships'] = [];
  for (let first = 0; first < factions.length; first++) {
    for (let second = first + 1; second < factions.length; second++) {
      const { key: roll, result: relationship } =
        randomOptionEntry(tableDungeonFactionRelationship, rollFn);
      relationships.push({
        firstFaction: factions[first].number,
        secondFaction: factions[second].number,
        roll,
        relationship,
      });
    }
  }
  return relationships;
}

function generateSecretDoor(rollFn: RollFunction): DungeonTableResult[] {
  const form = randomOptionEntry(tableDungeonSecretDoorForm, rollFn);
  const formResult: DungeonTableResult = {
    table: tableDungeonSecretDoorForm.title,
    roll: form.key,
    result: form.result,
  };
  if (form.result === 'Camouflaged') {
    const appearance = randomOptionEntry(tableDungeonCamouflagedDoorAppearance, rollFn);
    const clue = randomOptionEntry(tableDungeonCamouflagedDoorClue, rollFn);
    return [
      formResult,
      {
        table: tableDungeonCamouflagedDoorAppearance.title,
        roll: appearance.key,
        result: appearance.result,
      },
      {
        table: tableDungeonCamouflagedDoorClue.title,
        roll: clue.key,
        result: clue.result,
      },
    ];
  }
  const type = randomOptionEntry(tableDungeonVisibleSecretDoorType, rollFn);
  const mechanism = randomOptionEntry(tableDungeonSecretDoorMechanism, rollFn);
  return [
    formResult,
    {
      table: tableDungeonVisibleSecretDoorType.title,
      roll: type.key,
      result: type.result,
    },
    {
      table: tableDungeonSecretDoorMechanism.title,
      roll: mechanism.key,
      result: mechanism.result,
    },
  ];
}

function generateDoor(rollFn: RollFunction, corridorSide?: string): DungeonDoor {
  const position = corridorSide ??
    randomOptionEntry(tableDungeonRoomDoorPosition, rollFn).result;
  const destination = corridorSide
    ? 'Room'
    : randomOptionEntry(tableDungeonDoorDestination, rollFn).result;
  const doorType = randomOptionEntry(tableDungeonDoorType, rollFn);
  if (doorType.result === 'Magic door') {
    const magicDoor = randomOptionEntry(tableDungeonMagicDoorType, rollFn);
    const magicDoorDetail: DungeonTableResult = {
      table: tableDungeonMagicDoorType.title,
      roll: magicDoor.key,
      result: magicDoor.result,
    };
    if (magicDoor.result === 'Demon door') {
      const task = randomOptionEntry(tableDungeonDemonDoorTask, rollFn);
      return {
        position,
        destination,
        type: magicDoor.result,
        details: [
          magicDoorDetail,
          {
            table: tableDungeonDemonDoorTask.title,
            roll: task.key,
            result: task.result,
          },
        ],
      };
    }
    return {
      position,
      destination,
      type: magicDoor.result,
      details: [magicDoorDetail],
    };
  }
  return {
    position,
    destination,
    type: doorType.result,
    details: null,
  };
}

function generateRoom(
  number: number,
  depth: DungeonDepth,
  encounters: DungeonEncounter[],
  options: DungeonOptions,
  rollFn: RollFunction,
): DungeonRoom {
  const typeEntry = randomOptionEntry(tableDungeonRoomType, rollFn);
  const type: DungeonRoomType = typeEntry.result.startsWith('Trap') ? 'trap' :
    typeEntry.result.startsWith('Empty') ? 'empty' :
      typeEntry.result.startsWith('Special') ? 'special' : 'monsters';
  const treasureChance = typeEntry.result.match(/\((\d+)%\)/)?.[1];
  const chance = treasureChance === undefined ? null : Number(treasureChance);
  const treasureRoll = chance === null ? null : rollFn(100);
  let monster: DungeonMonsterResult | null = null;
  let isLair: boolean | null = null;
  let detail: DungeonTableResult | null = null;
  if (type === 'trap') {
    const trap = randomOptionEntry(tableDungeonTrap, rollFn);
    detail = { table: tableDungeonTrap.title, roll: trap.key, result: trap.result };
  } else if (type === 'empty' || type === 'special') {
    const table = type === 'empty' ? tableDungeonEmptyRoom : tableDungeonSpecialRoom;
    const result = randomOptionEntry(table, rollFn);
    detail = { table: table.title, roll: result.key, result: result.result };
  } else {
    const encounterRoll = rollFn(6);
    let cumulativeChance = 0;
    const encounter = encounters.find((entry) => {
      cumulativeChance += entry.chance;
      return encounterRoll <= cumulativeChance;
    });
    if (!encounter) {
      throw new Error('Dungeon wandering-monster chances do not total six.');
    }
    monster = encounter.monster;
    const key = `${monster.level}:${monster.roll}`;
    const percentInLair = options.percentInLairByMonsterResult?.[key] ?? 20;
    isLair = rollFn(100) <= percentInLair;
  }

  const sizeResult = randomOptionEntry(tableDungeonRoomSize, rollFn).result;
  const size = sizeResult.split(' ')[0];
  const dimensionDice = size === 'Medium' ? 4 : size === 'Small' ? 3 : 6;
  const dimensionBonus = size === 'Medium' ? 2 : size === 'Small' ? 1 : 3;
  const doorEntry = randomOptionEntry(tableDungeonDoorCount, rollFn);
  const doorCount = doorEntry.result === 'One' ? 1 :
    doorEntry.result === 'Two' ? 2 :
      doorEntry.result === 'Three' ? 3 : 0;
  const doors = Array.from({ length: doorCount }, () => generateDoor(rollFn));
  if (doorEntry.result === 'Secret door') {
    doors.push({
      position: 'Secret',
      destination: 'Room',
      type: 'Secret door',
      details: generateSecretDoor(rollFn),
    });
  }

  return {
    number,
    type,
    detail,
    treasureChance: chance,
    treasureRoll,
    hasTreasure: chance === null ? null : treasureRoll! <= chance,
    size,
    length: rollFn(dimensionDice) + dimensionBonus,
    width: rollFn(dimensionDice) + dimensionBonus,
    shape: options.includeRoomShapes
      ? randomOptionEntry(tableDungeonRoomShape, rollFn).result
      : null,
    monster,
    isLair,
    doors,
  };
}

function generateLevel(
  number: number,
  depth: DungeonDepth,
  sublevel: number,
  options: DungeonOptions,
  rollFn: RollFunction,
): DungeonLevel {
  const factions = generateFactions(depth, rollFn);
  const wanderingMonsters = generateWanderingMonsters(depth, factions, rollFn);
  const roomCount = rollDice(2, 20, rollFn) + 10;
  return {
    number,
    depth,
    sublevel,
    roomCount,
    factions,
    wanderingMonsters,
    factionRelationships: generateFactionRelationships(factions, rollFn),
    rooms: Array.from(
      { length: roomCount },
      (_, index) => generateRoom(index + 1, depth, wanderingMonsters, options, rollFn),
    ),
  };
}

function generateArea(
  number: number,
  options: DungeonOptions,
  rollFn: RollFunction,
): DungeonArea {
  const prefix = randomOptionEntry(tableDungeonAreaNamePrefix, rollFn);
  const noun = randomOptionEntry(tableDungeonAreaNameNoun, rollFn);
  const name = {
    prefixRoll: prefix.key,
    nounRoll: noun.key,
    result: prefix.result.replace('...', noun.result),
  };
  const theme = randomOptionEntry(tableDungeonAreaTheme, rollFn);
  const levelCount = rollFn(6);
  const depths = Array.from({ length: levelCount }, () => dungeonDepth(rollFn(6)))
    .sort((first, second) => first - second);
  const depthCounts: { [depth: number]: number } = {};
  const levels = depths.map((depth, index) => {
    const sublevel = (depthCounts[depth] ?? 0) + 1;
    depthCounts[depth] = sublevel;
    return generateLevel(index + 1, depth, sublevel, options, rollFn);
  });
  return {
    number,
    name,
    themeRoll: theme.key,
    theme: theme.result,
    levels,
  };
}

function calcDungeonCorridor(options: DungeonCorridorOptions = {}): DungeonCorridor {
  const rollFn = options.rollFn ?? d;
  const length = randomOptionEntry(tableDungeonCorridorLength, rollFn);
  const sectionCount = length.result === 'One section' ? 1 :
    length.result === 'Two sections' ? 2 : 3;
  const sections = Array.from({ length: sectionCount }, (_, index) => {
    const feature = randomOptionEntry(tableDungeonCorridorFeatures, rollFn);
    let features: string[] = [];
    if (feature.result === 'One door') {
      const side = randomOptionEntry(tableDungeonCorridorDoorSide, rollFn).result.toLowerCase();
      const door = generateDoor(rollFn, side);
      features = [`Door on ${side}: ${door.type} (opens to a room)`];
    } else if (feature.result === 'Two doors') {
      features = Array.from({ length: 2 }, () => {
        const side = randomOptionEntry(tableDungeonCorridorDoorSide, rollFn).result.toLowerCase();
        const door = generateDoor(rollFn, side);
        return `Door on ${side}: ${door.type} (opens to a room)`;
      });
    } else if (feature.result === 'Secret door') {
      features = [`Secret door: ${generateSecretDoor(rollFn).map((entry) => `${entry.table}: ${entry.result} (#${entry.roll})`).join('; ')}`];
    } else if (feature.result === 'Trap') {
      const trap = randomOptionEntry(tableDungeonTrap, rollFn);
      features = [`${tableDungeonTrap.title}: ${trap.result} (d100: ${trap.key})`];
    }
    return { number: index + 1, length: 6 as const, features };
  });

  let end: string;
  let attempts = 0;
  do {
    end = randomOptionEntry(tableDungeonCorridorEnd, rollFn).result;
    attempts++;
    if (attempts === 100) {
      throw new Error('Could not roll a corridor end compatible with the available levels.');
    }
  } while (
    (end === 'Stairs to a deeper level' && !options.hasDeeperLevel) ||
    (end === 'Stairs to a higher level' && !options.hasHigherLevel)
  );
  return { sections, end };
}

function generateCrossSectionLinks(areas: DungeonArea[], rollFn: RollFunction): DungeonLink[] {
  const links: DungeonLink[] = [];
  for (const area of areas) {
    const levelsAtDepth = new Map<number, DungeonLevel[]>();
    for (const level of area.levels) {
      const peers = levelsAtDepth.get(level.depth) ?? [];
      for (const peer of peers) {
        if (randomOptionEntry(tableDungeonSublevelLink, rollFn).result === 'Linked') {
          links.push({
            fromArea: area.number,
            fromLevel: peer.number,
            toArea: area.number,
            toLevel: level.number,
            type: 'same-depth',
          });
        }
      }
      peers.push(level);
      levelsAtDepth.set(level.depth, peers);
    }
  }

  for (let index = 0; index < areas.length - 1; index++) {
    const area = areas[index];
    const nextArea = areas[index + 1];
    for (const level of area.levels) {
      const link = randomOptionEntry(tableDungeonCrossSectionLinks, rollFn);
      const linkCount = link.result === 'Zero' ? 0 : link.result === 'Two' ? 2 : 1;
      const type = link.result.includes('secret') ? 'secret' : 'corridor';
      for (let link = 0; link < linkCount; link++) {
        const candidates = nextArea.levels.filter(
          (candidate) => Math.abs(candidate.depth - level.depth) <= 1,
        );
        if (!candidates.length) {
          break;
        }
        const sameDepth = candidates.filter((candidate) => candidate.depth === level.depth);
        const above = candidates.filter((candidate) => candidate.depth < level.depth);
        const below = candidates.filter((candidate) => candidate.depth > level.depth);
        let targetDepth: string;
        if (sameDepth.length && (above.length || below.length)) {
          targetDepth = randomOptionEntry(tableDungeonLinkTarget, rollFn).result;
        } else if (sameDepth.length) {
          targetDepth = 'Same level';
        } else {
          targetDepth = randomOptionEntry(tableDungeonLinkTargetWithoutSameDepth, rollFn).result;
        }
        let targetPool = targetDepth === 'Same level'
          ? sameDepth
          : targetDepth === 'Above'
            ? above
            : below;
        if (!targetPool.length) {
          targetPool = targetDepth === 'Above' ? below : above;
        }
        const target = targetPool[rollFn(targetPool.length) - 1];
        links.push({
          fromArea: area.number,
          fromLevel: level.number,
          toArea: nextArea.number,
          toLevel: target.number,
          type,
        });
      }
    }
  }
  return links;
}

function calcDungeon(options: DungeonOptions = {}): Dungeon {
  const rollFn = options.rollFn ?? d;
  const areaCount = options.areaCount ?? 1;
  if (!Number.isInteger(areaCount) || areaCount < 1) {
    throw new RangeError('Dungeon areaCount must be a positive integer.');
  }
  for (const [monsterResult, percentage] of Object.entries(options.percentInLairByMonsterResult ?? {})) {
    if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
      throw new RangeError(`% in lair for monster result ${monsterResult} must be between 0 and 100.`);
    }
  }

  const areas = Array.from(
    { length: areaCount },
    (_, index) => generateArea(index + 1, options, rollFn),
  );
  const links = generateCrossSectionLinks(areas, rollFn);
  for (const area of areas) {
    const highestLevel = area.levels.reduce(
      (highest, level) => level.depth < highest.depth ? level : highest,
    );
    links.push({
      fromArea: 0,
      fromLevel: 0,
      toArea: area.number,
      toLevel: highestLevel.number,
      type: 'vertical',
    });
    const levelsByDepth = [...area.levels].sort(
      (first, second) => first.depth - second.depth || first.sublevel - second.sublevel,
    );
    for (let index = 1; index < levelsByDepth.length; index++) {
      links.push({
        fromArea: area.number,
        fromLevel: levelsByDepth[index - 1].number,
        toArea: area.number,
        toLevel: levelsByDepth[index].number,
        type: 'vertical',
      });
    }
  }
  return { areas, links };
}

export {
  calcDungeon,
  calcDungeonCorridor,
  type Dungeon,
  type DungeonArea,
  type DungeonCorridor,
  type DungeonCorridorOptions,
  type DungeonDepth,
  type DungeonEncounter,
  type DungeonFaction,
  type DungeonLevel,
  type DungeonLink,
  type DungeonMonsterResult,
  type DungeonOptions,
  type DungeonRoom,
  type DungeonTableResult,
};
