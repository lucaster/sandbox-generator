import { d } from '../dice/dice';
import { type RandomTable } from '../domain/random-table';
import { randomOptionEntry } from './data';
import { neighborsOfPatchHex } from './hex-grid';
import { calcBiomeEncounter } from './lairs';

type WildernessEncounterCategory =
  | 'Dragon'
  | 'Other faction'
  | 'Faction'
  | 'NPCs'
  | 'Biome'
  | 'Wizard';

type WildernessEncounterFactionCount = 'one' | 'multiple' | null;

type WildernessEncounterContext = {
  hex: number;
  biome: string;
  // Faction numbers per hex, as returned by calcFactions().hexFactions.
  hexFactions?: { [hex: number]: number[] };
  // Adjacency lookup; defaults to the canonical 19-hex patch topology.
  neighbors?: (hex: number) => number[];
};

type WildernessEncounter = {
  hex: number;
  biome: string;
  roll: number;
  category: WildernessEncounterCategory;
  // For a contested hex, whether one or several factions are involved.
  factionCount: WildernessEncounterFactionCount;
  contested: boolean;
  // True when a Faction/Other faction result had no nearby faction and fell
  // back to a biome encounter.
  fallback: boolean;
  factions: number[];
  monster: string | null;
  note: string;
};

const tableWildernessEncounter: RandomTable = {
  id: 150,
  title: 'Wilderness Encounter',
  dice: '2d6',
  options: {
    2: 'Dragon',
    3: 'Other faction',
    4: 'Faction',
    5: 'Faction',
    6: 'Faction',
    7: 'NPCs',
    8: 'Biome',
    9: 'Biome',
    10: 'Biome',
    11: 'Biome',
    12: 'Wizard',
  },
};

const tableContestedFactionCount: RandomTable = {
  id: 151,
  title: 'Contested Hex Faction Count',
  dice: '1d6',
  options: {
    1: 'Only one',
    2: 'Only one',
    3: 'Only one',
    4: 'Only one',
    5: 'Multiple',
    6: 'Multiple',
  },
};

function uniqueSorted(values: number[]): number[] {
  return Array.from(new Set(values)).sort((a, b) => a - b);
}

function pickOne<T>(values: T[], rollFn: (faces: number) => number): T {
  return values[rollFn(values.length) - 1];
}

function factionNote(factions: number[]): string {
  return factions.length === 1
    ? `Encounter related to faction ${factions[0]}.`
    : `Encounter related to factions ${factions.join(', ')}.`;
}

/**
 * Rolls a wilderness random encounter for one hex (2023 edition, p. 14).
 *
 * The 2d6 table routes to Dragon, Other faction, Faction, NPCs, Biome, or
 * Wizard. Dragon and Wizard only flag that the next lair/tower is theirs; the
 * NPC, dragon, and wizard generators are separate chapters and are not part of
 * this procedure.
 *
 * Faction encounters use the current hex's factions. Other faction encounters
 * use a faction from an adjacent hex. A contested current hex rolls 1d6 to
 * decide whether one or several factions are involved. If neither the current
 * hex nor an adjacent one has a faction, the result falls back to a biome
 * encounter.
 */
function calcWildernessEncounter(
  context: WildernessEncounterContext,
  rollFn: (faces: number) => number = d
): WildernessEncounter {
  const neighbors = context.neighbors ?? neighborsOfPatchHex;
  const hexFactions = context.hexFactions ?? {};
  const current = uniqueSorted(hexFactions[context.hex] ?? []);
  const adjacent = uniqueSorted(
    neighbors(context.hex).flatMap((neighbor) => hexFactions[neighbor] ?? [])
  ).filter((faction) => !current.includes(faction));
  const contested = current.length > 1;

  const entry = randomOptionEntry(tableWildernessEncounter, rollFn);
  const category = entry.result as WildernessEncounterCategory;

  const base = {
    hex: context.hex,
    biome: context.biome,
    roll: entry.key,
    category,
    factionCount: null as WildernessEncounterFactionCount,
    contested,
    fallback: false,
    factions: [] as number[],
    monster: null as string | null,
  };

  if (category === 'Dragon') {
    return {
      ...base,
      note: "The next lair generated will be the dragon's lair.",
    };
  }

  if (category === 'Wizard') {
    return {
      ...base,
      note: "The next tower generated will be the wizard's house.",
    };
  }

  if (category === 'NPCs') {
    return {
      ...base,
      note: 'Friendly NPCs who do not appear to belong to a faction.',
    };
  }

  if (category === 'Biome') {
    const monster = calcBiomeEncounter(context.biome, rollFn);
    return {
      ...base,
      monster,
      note: `Biome encounter: ${monster}.`,
    };
  }

  // Faction and Other faction.
  let pool =
    category === 'Faction'
      ? current.length > 0
        ? current
        : adjacent
      : adjacent.length > 0
        ? adjacent
        : current;

  if (pool.length === 0) {
    const monster = calcBiomeEncounter(context.biome, rollFn);
    return {
      ...base,
      fallback: true,
      monster,
      note: `No faction in this hex or an adjacent one; biome encounter instead: ${monster}.`,
    };
  }

  // The contested table only applies to the current hex's own faction.
  let factionCount: WildernessEncounterFactionCount = 'one';
  if (category === 'Faction' && contested) {
    const count = randomOptionEntry(tableContestedFactionCount, rollFn).result;
    factionCount = count === 'Multiple' ? 'multiple' : 'one';
  }

  if (factionCount === 'one' && pool.length > 1) {
    pool = [pickOne(pool, rollFn)];
  }

  return {
    ...base,
    factionCount,
    factions: pool,
    note: factionNote(pool),
  };
}

export {
  calcWildernessEncounter,
  tableContestedFactionCount,
  tableWildernessEncounter,
  type WildernessEncounter,
  type WildernessEncounterCategory,
  type WildernessEncounterContext,
  type WildernessEncounterFactionCount,
};
