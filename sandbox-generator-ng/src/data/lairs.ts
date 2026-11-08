
import { d } from "../dice/dice";
import { RandomTable } from "../domain/random-table";
import { randomOptionEntry } from "./data";

const lairLayout: RandomTable = {
  id: 80,
  title: 'Lair Layout',
  options: {
    1: '1',
    2: '2',
    3: '2',
    4: '3',
    5: '3',
    6: '4',
    7: '4',
    8: '5',
  },
};

// Percentage of monsters and treasure found in each room.
// Layout 4 uses the order of the book's worked example (12/24/24/60):
// it is the same multiset as the diagram's 20/50/10/20.
// The 2023 edition prints 40/20/20 for layout 3 (sums to 80); the corrected
// 40/30/30 is used here.
const lairLayoutPercentages: { [layout: number]: number[] } = {
  1: [100],
  2: [75, 25],
  3: [40, 30, 30],
  4: [10, 20, 20, 50],
  5: [40, 20, 15, 10, 15],
};

type LairTreasure = { [denomination: string]: number };

type LairOptions = {
  // The 2023 book delegates the total number of monsters and their treasure to
  // an external bestiary, so the caller supplies them.
  totalMonsters?: number;
  treasure?: LairTreasure;
  // % in lair of the monster (20% by default, 0% if it does not live in lairs).
  percentInLair?: number;
  // Small groups (or alone) use 1d3 for the layout instead of 1d8.
  smallGroups?: boolean;
  // The book marks the outside-monster proportion as optional.
  rollOutside?: boolean;
};

/**
 * Splits an integer total across rooms using the largest remainder method, so
 * the room values always add up to the total.
 */
function distribute(total: number, percentages: number[]): number[] {
  const exact = percentages.map((percentage) => (total * percentage) / 100);
  const result = exact.map(Math.floor);
  const remainder = total - result.reduce((sum, value) => sum + value, 0);
  const byFraction = exact
    .map((value, index) => ({ index, fraction: value - Math.floor(value) }))
    .sort((a, b) => b.fraction - a.fraction);
  for (let i = 0; i < remainder; i++) {
    result[byFraction[i % byFraction.length].index] += 1;
  }
  return result;
}

function distributeTreasure(
  treasure: LairTreasure,
  percentages: number[]
): LairTreasure[] {
  const denominations = Object.keys(treasure);
  const perDenomination = denominations.map((denomination) =>
    distribute(treasure[denomination], percentages)
  );
  return percentages.map((_, roomIndex) => {
    const room: LairTreasure = {};
    denominations.forEach((denomination, denominationIndex) => {
      room[denomination] = perDenomination[denominationIndex][roomIndex];
    });
    return room;
  });
}

const biomeEncountersGrassland: RandomTable = {
  id: 81,
  title: 'Biome Encounter Grassland',
  dice: '2d6',
  options: {
    2: 'Dinosaurs',
    3: 'Ogres',
    4: 'Gnolls',
    5: 'Orcs',
    6: 'Goblins',
    7: 'Giant rats',
    8: 'Wolves',
    9: 'Bandits',
    10: 'Berserkers',
    11: 'Worgs',
    12: 'Werewolves',
  },
};

const biomeEncountersMarsh: RandomTable = {
  id: 82,
  title: 'Biome Encounter Marsh',
  dice: '2d6',
  options: {
    2: 'Moth-men',
    3: 'Mushroom-men',
    4: 'Frog-men',
    5: 'Trolls',
    6: 'Skeletons',
    7: 'Crocodiles',
    8: 'Zombies',
    9: 'Orcs',
    10: 'Lizard-men',
    11: 'Snake-men',
    12: 'Hydras',
  },
};

const biomeEncountersForest: RandomTable = {
  id: 83,
  title: 'Biome Encounter Forest',
  dice: '2d6',
  options: {
    2: 'Ents',
    3: 'Giant spiders',
    4: 'Ogres',
    5: 'Bears',
    6: 'Goblins',
    7: 'Wolves',
    8: 'Kobolds',
    9: 'Bandits',
    10: 'Elves',
    11: 'Dryads',
    12: 'Werewolves',
  },
};

const biomeEncountersMountains: RandomTable = {
  id: 84,
  title: 'Biome Encounter Mountains',
  dice: '2d6',
  options: {
    2: 'Giants',
    3: 'Griffins',
    4: 'Dwarves',
    5: 'Kobolds',
    6: 'Orcs',
    7: 'Bears',
    8: 'Wolves',
    9: 'Bandits',
    10: 'Berserkers',
    11: 'Smilodons',
    12: 'Vampires',
  },
};

const biomeEncountersHills: RandomTable = {
  id: 85,
  title: 'Biome Encounter Hills',
  dice: '2d6',
  options: {
    2: 'Manticores',
    3: 'Basilisks',
    4: 'Ogres',
    5: 'Orcs',
    6: 'Goblins',
    7: 'Giant rats',
    8: 'Wolves',
    9: 'Bandits',
    10: 'Beastmen',
    11: 'Giants',
    12: 'Wyverns',
  },
};

const biomeEncounterTables: { [biome: string]: RandomTable } = {
  'Grassland': biomeEncountersGrassland,
  'Marsh': biomeEncountersMarsh,
  'Forest': biomeEncountersForest,
  'Mountains': biomeEncountersMountains,
  'Hills': biomeEncountersHills,
};

/**
 * Rolls a wilderness monster on the fitting biome table (2023 edition, p. 10).
 * The same tables are used for lair inhabitants.
 */
function calcBiomeEncounter(
  biome: string,
  rollFn: (faces: number) => number = d
): string {
  const table = biomeEncounterTables[biome];
  if (!table) {
    throw new Error(`Unknown biome: ${biome}`);
  }
  return randomOptionEntry(table, rollFn).result;
}

function calcLair(
  biome: string,
  options: LairOptions = {},
  rollFn: (faces: number) => number = d
) {
  // 1. INHABITANTS
  const inhabitants = calcBiomeEncounter(biome, rollFn);

  // 2. % IN LAIR
  // When a faction encounter happens in a hex containing a lair, the monster's
  // % in lair decides whether the PCs find the lair or merely a patrol.
  const percentInLair = options.percentInLair ?? null;
  const encounter =
    percentInLair === null
      ? null
      : rollFn(100) <= percentInLair
        ? 'lair'
        : 'patrol';

  // 3. MONSTERS OUTSIDE THE LAIR (optional)
  const rollOutside = options.rollOutside ?? true;
  const percOutsideLair = rollOutside ? rollFn(6) * 10 : 0;
  const percInsideLair = 100 - percOutsideLair;

  // 4. OUTSIDE HEXES
  // An 8 means the force is split in two; each group rolls 1d8.
  let outsideHexes: number[] = [];
  if (rollOutside) {
    outsideHexes = [rollFn(8)];
    if (outsideHexes[0] === 8) {
      outsideHexes = [rollFn(8), rollFn(8)];
    }
  }

  // 5. LAYOUT
  const layout = options.smallGroups
    ? rollFn(3)
    : Number(randomOptionEntry(lairLayout, rollFn).result);
  const percentages = lairLayoutPercentages[layout];

  // 6. TOTAL MONSTERS AND TREASURE
  const totalMonsters = options.totalMonsters ?? null;
  let outsideMonsters: number | null = null;
  let insideMonsters: number | null = null;
  let monsterDistribution: number[] | null = null;
  if (totalMonsters !== null) {
    outsideMonsters = Math.round((totalMonsters * percOutsideLair) / 100);
    insideMonsters = totalMonsters - outsideMonsters;
    monsterDistribution = distribute(insideMonsters, percentages);
  }

  const treasure = options.treasure ?? null;
  const treasureDistribution = treasure
    ? distributeTreasure(treasure, percentages)
    : null;

  const rooms = percentages.map((percentage, index) => ({
    number: index + 1,
    percentage,
    monsters: monsterDistribution ? monsterDistribution[index] : null,
    treasure: treasureDistribution ? treasureDistribution[index] : null,
  }));

  return {
    biome,
    inhabitants,
    layout,
    percentages,
    percentInLair,
    encounter,
    percInsideLair,
    percOutsideLair,
    outsideHexes,
    totalMonsters,
    insideMonsters,
    outsideMonsters,
    treasure,
    rooms,
  };
}

export {
  biomeEncountersMarsh,
  calcBiomeEncounter,
  calcLair,
  lairLayout,
  lairLayoutPercentages,
  type LairOptions,
  type LairTreasure,
};
