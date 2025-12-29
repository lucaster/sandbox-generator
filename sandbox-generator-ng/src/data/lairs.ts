
import { d } from "../dice/dice";
import { RandomTable } from "../domain/random-table";
import { randomOption } from "./data";

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

const biomeEncountersGrassland: RandomTable = {
  id: 81,
  title: 'Biome Encounter Grassland',
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

function calcLair(biome: string) {
  // 1. INHABITANTS
  // 1. roll for Inhabitants: dipendono dal Biome
  const biomesAndItsInhabitants: { [key: string]: RandomTable } = {
    'Grassland': biomeEncountersGrassland,
    'Marsh': biomeEncountersMarsh,
    'Forest': biomeEncountersForest,
    'Mountains': biomeEncountersMountains,
    'Hills': biomeEncountersHills,
  };
  const biomeInhabitantsTable = biomesAndItsInhabitants[biome];
  const inhabitants = randomOption(biomeInhabitantsTable.options);
  // 2. roll for number of inhabitants
  // 3. roll for treasure
  // 4. roll 1d6 * 10% proportions of inhabitants who are outside the lair
  const percOutsideLair = d(6) * 10;
  const percInsideLair = 100 - percOutsideLair;
  // 5. roll 1d8 to calculate in which hex the monsters that are outside the lair:
  //    if 8 --> they are in two exes --> roll 1d7 each
  //             _______
  //            /       \
  //    _______/    2    \_______
  //   /       \         /       \
  //  /    7    \_______/    3    \
  //  \         /       \         /
  //   \_______/    1    \_______/
  //   /       \    L    /       \
  //  /    6    \_______/    4    \
  //  \         /       \         /
  //   \______ /    5    \_______/
  //           \         /
  //            \_______/

  let outsideHexes: [number] | [number, number] = [d(8)];
  if (outsideHexes[0] === 8) {
    const a = d(7);
    const b = dExcept(7, a);
    outsideHexes = [a, b];
  }
  // 2. LAYOUT
  // Each room in a layout has a percentage of inhabitants and treasure
  const layout = d(5);
  const lair = {
    biome,
    inhabitants,
    percInsideLair,
    percOutsideLair,
    outsideHexes,
    layout,
  };
  return lair;
}

function dExcept(die: number, except: number): number {
  let res = d(die);
  while (res === except) {
    res = d(die);
  }
  return res;
}

export {
  calcLair
};


