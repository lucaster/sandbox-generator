import { d } from '../dice/dice';
import { type RandomTable } from '../domain/random-table';
import { randomOptionEntry } from './data';

type DragonLocation = 'wilderness' | 'dungeon';

type Dragon = {
  name: string;
  alignment: string;
  size: string;
  age: string;
  breath: string;
  color: string;
  strength: string | null;
  weakness: string | null;
  favoriteFood: string;
  status: string;
  stats: {
    hitPoints: number;
    armorClass: number;
    savingThrows: string;
    morale: number;
  };
  attacks: {
    claws: string;
    bite: string;
    tail: string;
    breathWeapon: string;
  };
  lair: string;
  specialTreasure: string | null;
};

const tableDragonName: RandomTable = {
  id: 152,
  title: 'Dragon Name',
  dice: '1d12',
  options: {
    1: 'Arkos',
    2: 'Dalum',
    3: 'Enoch',
    4: 'Franil',
    5: 'Irken',
    6: 'Myriad',
    7: 'Numin',
    8: 'Ragor',
    9: 'Sarhin',
    10: 'Tychos',
    11: 'Xerius',
    12: 'Zéphyr',
  },
};

const tableDragonAlignment: RandomTable = {
  id: 153,
  title: 'Dragon Alignment',
  dice: '1d6',
  options: {
    1: 'Chaotic',
    2: 'Chaotic',
    3: 'Chaotic',
    4: 'Neutral',
    5: 'Neutral',
    6: 'Lawful',
  },
};

const tableDragonSize: RandomTable = {
  id: 154,
  title: 'Dragon Size',
  dice: '1d8',
  options: {
    1: 'Small',
    2: 'Small',
    3: 'Average',
    4: 'Average',
    5: 'Average',
    6: 'Average',
    7: 'Average',
    8: 'Huge',
  },
};

const tableDragonAge: RandomTable = {
  id: 155,
  title: 'Dragon Age',
  dice: '1d12',
  options: {
    1: 'Baby',
    2: 'Young',
    3: 'Young',
    4: 'Adult',
    5: 'Adult',
    6: 'Adult',
    7: 'Adult',
    8: 'Adult',
    9: 'Adult',
    10: 'Old',
    11: 'Old',
    12: 'Ancient',
  },
};

const tableDragonBreath: RandomTable = {
  id: 156,
  title: 'Dragon Breath',
  dice: '1d4',
  options: {
    1: 'Acid (line)',
    2: 'Fire (cone)',
    3: 'Ice (cone)',
    4: 'Lightning (line)',
  },
};

const tableDragonAcidColor: RandomTable = {
  id: 157,
  title: 'Dragon Acid Color',
  dice: '1d6',
  options: {
    1: 'Green',
    2: 'Green',
    3: 'Green',
    4: 'Black',
    5: 'Black',
    6: 'Bronze',
  },
};

const tableDragonFireColor: RandomTable = {
  id: 158,
  title: 'Dragon Fire Color',
  dice: '1d6',
  options: {
    1: 'Red',
    2: 'Red',
    3: 'Red',
    4: 'Brown',
    5: 'Brown',
    6: 'Copper',
  },
};

const tableDragonIceColor: RandomTable = {
  id: 159,
  title: 'Dragon Ice Color',
  dice: '1d6',
  options: {
    1: 'Blue',
    2: 'Blue',
    3: 'Blue',
    4: 'White',
    5: 'White',
    6: 'Silver',
  },
};

const tableDragonLightningColor: RandomTable = {
  id: 160,
  title: 'Dragon Lightning Color',
  dice: '1d6',
  options: {
    1: 'Yellow',
    2: 'Yellow',
    3: 'Yellow',
    4: 'Gray',
    5: 'Gray',
    6: 'Gold',
  },
};

const dragonColorTables: { [breath: string]: RandomTable } = {
  'Acid (line)': tableDragonAcidColor,
  'Fire (cone)': tableDragonFireColor,
  'Ice (cone)': tableDragonIceColor,
  'Lightning (line)': tableDragonLightningColor,
};

const tableDragonStrength: RandomTable = {
  id: 161,
  title: 'Dragon Strength',
  dice: '1d10',
  options: {
    1: 'Armor (+2 AC)',
    2: 'Bone plates (+1 AC)',
    3: 'Good nose',
    4: 'Lies detection',
    5: 'Persuasive voice',
    6: 'Poisonous claws (adds poison to claw attack)',
    7: 'Poisonous spines',
    8: 'Tail club (+1d6 damage to tail attack)',
    9: 'Two hearts',
    10: 'Underwater breathing',
  },
};

const tableDragonWeakness: RandomTable = {
  id: 162,
  title: 'Dragon Weakness',
  dice: '1d10',
  options: {
    1: 'Competitive mind',
    2: 'Cupidity',
    3: 'Curiosity',
    4: 'Flattery',
    5: 'Hurt scale (-1 AC)',
    6: 'Perforated wings (-2 AC)',
    7: 'Pride',
    8: 'Remorse',
    9: 'Self-confidence',
    10: 'Sunlight',
  },
};

const tableDragonFavoriteFood: RandomTable = {
  id: 163,
  title: 'Dragon Favorite Food',
  dice: '1d8',
  options: {
    1: 'None',
    2: 'Adventurers',
    3: 'Cattle',
    4: 'Children',
    5: 'Humans',
    6: 'Nobles',
    7: 'Other monsters',
    8: 'Rare animals',
  },
};

const tableDragonStatusWilderness: RandomTable = {
  id: 164,
  title: 'Dragon Status (Wilderness)',
  dice: '1d10',
  options: {
    1: 'Attacking someone',
    2: 'Carrying treasure',
    3: 'Flying',
    4: 'Hunted down',
    5: 'Hunting',
    6: 'Making a deal',
    7: 'Protecting its territory',
    8: 'Returning to its lair',
    9: 'Taking revenge',
    10: 'Terrorizing people',
  },
};

const tableDragonStatusDungeon: RandomTable = {
  id: 165,
  title: 'Dragon Status (Dungeon/Lair)',
  dice: '1d10',
  options: {
    1: 'Aggressive',
    2: 'Chained',
    3: 'Defensive',
    4: 'Enraged',
    5: 'Hiding',
    6: 'Hurt',
    7: 'Neutral',
    8: 'Protecting its egg/baby',
    9: 'Retired',
    10: 'Sleeping',
  },
};

const tableDragonSavingThrows: RandomTable = {
  id: 166,
  title: 'Dragon Saving Throws',
  dice: '1d6',
  options: {
    1: 'Fighter: 10',
    2: 'Fighter: 10',
    3: 'Fighter: 10',
    4: 'Fighter: 11',
    5: 'Fighter: 11',
    6: 'Fighter: 12',
  },
};

const tableDragonMorale: RandomTable = {
  id: 167,
  title: 'Dragon Morale',
  dice: '1d6',
  options: {
    1: '9',
    2: '9',
    3: '9',
    4: '10',
    5: '10',
    6: '11',
  },
};

const tableDragonClaws: RandomTable = {
  id: 168,
  title: 'Dragon Claws Damage',
  dice: '1d20',
  options: {
    1: '1d4',
    2: '1d4',
    3: '1d4',
    4: '1d4',
    5: '1d4',
    6: '1d4+1',
    7: '1d4+1',
    8: '1d4+1',
    9: '1d4+1',
    10: '1d4+1',
    11: '1d6',
    12: '1d6',
    13: '1d6',
    14: '1d6',
    15: '1d6+1',
    16: '1d6+1',
    17: '1d6+1',
    18: '1d8',
    19: '1d8',
    20: '2d8',
  },
};

const tableDragonBite: RandomTable = {
  id: 169,
  title: 'Dragon Bite Damage',
  dice: '1d20',
  options: {
    1: '2d8',
    2: '2d8',
    3: '2d8',
    4: '2d8',
    5: '2d8',
    6: '2d10',
    7: '2d10',
    8: '2d10',
    9: '2d10',
    10: '2d10',
    11: '3d8',
    12: '3d8',
    13: '3d8',
    14: '3d8',
    15: '3d10',
    16: '3d10',
    17: '3d10',
    18: '4d8',
    19: '4d8',
    20: '6d6',
  },
};

const tableDragonTail: RandomTable = {
  id: 170,
  title: 'Dragon Tail Damage',
  dice: '1d20',
  options: {
    1: '1d8',
    2: '1d8',
    3: '1d8',
    4: '1d8',
    5: '1d8',
    6: '1d10',
    7: '1d10',
    8: '1d10',
    9: '1d10',
    10: '1d10',
    11: '1d12',
    12: '1d12',
    13: '1d12',
    14: '1d12',
    15: '1d20',
    16: '1d20',
    17: '1d20',
    18: '2d8',
    19: '2d8',
    20: '3d6',
  },
};

const tableDragonLair: RandomTable = {
  id: 171,
  title: 'Dragon Lair',
  dice: '1d10',
  options: {
    1: 'Cave',
    2: 'Desecrated church',
    3: 'Giant nest',
    4: 'Giant tree',
    5: 'Mine',
    6: 'Overgrown tower',
    7: 'Rased village',
    8: 'Ruined castle',
    9: 'Tumulus',
    10: 'Volcano',
  },
};

const tableDragonSpecialTreasure: RandomTable = {
  id: 172,
  title: 'Dragon Special Treasure',
  dice: '1d10',
  options: {
    1: 'Access to an special location',
    2: 'Ancient realm crown',
    3: 'Giant gem',
    4: 'Lost art piece',
    5: 'Prisoner',
    6: 'Rare book',
    7: 'Renowned magic item',
    8: 'Secret/Knowledge',
    9: '(Treasure) map',
    10: 'Unique weapon',
  },
};

const dragonHitPoints: { [age: string]: { [size: string]: number } } = {
  Baby: { Small: 3, Average: 6, Huge: 12 },
  Young: { Small: 9, Average: 18, Huge: 36 },
  Adult: { Small: 15, Average: 30, Huge: 60 },
  Old: { Small: 21, Average: 42, Huge: 84 },
  Ancient: { Small: 27, Average: 54, Huge: 108 },
};

const dragonArmorClass: { [color: string]: number } = {
  Green: 18,
  Red: 18,
  Blue: 18,
  Yellow: 18,
  Black: 20,
  Brown: 20,
  White: 20,
  Gray: 20,
  Bronze: 22,
  Copper: 22,
  Silver: 22,
  Gold: 22,
};

/**
 * Generates a dragon from the 2023 edition Generators chapter (p. 121-124).
 *
 * The status table depends on where the dragon is encountered: the wilderness
 * table is used by default, and the dungeon/lair table can be selected
 * explicitly.
 */
function calcDragon(
  location: DragonLocation = 'wilderness',
  rollFn: (faces: number) => number = d
): Dragon {
  const name = randomOptionEntry(tableDragonName, rollFn).result;
  const alignment = randomOptionEntry(tableDragonAlignment, rollFn).result;
  const size = randomOptionEntry(tableDragonSize, rollFn).result;
  const age = randomOptionEntry(tableDragonAge, rollFn).result;
  const breath = randomOptionEntry(tableDragonBreath, rollFn).result;
  const color = randomOptionEntry(dragonColorTables[breath], rollFn).result;

  const strength =
    rollFn(6) === 1
      ? randomOptionEntry(tableDragonStrength, rollFn).result
      : null;
  const weakness =
    rollFn(6) === 1
      ? randomOptionEntry(tableDragonWeakness, rollFn).result
      : null;
  const favoriteFood =
    randomOptionEntry(tableDragonFavoriteFood, rollFn).result;

  const statusTable =
    location === 'dungeon'
      ? tableDragonStatusDungeon
      : tableDragonStatusWilderness;
  const status = randomOptionEntry(statusTable, rollFn).result;

  const savingThrows =
    randomOptionEntry(tableDragonSavingThrows, rollFn).result;
  const moraleRoll = Number(
    randomOptionEntry(tableDragonMorale, rollFn).result
  );
  const morale = moraleRoll + (size === 'Huge' ? 1 : 0);

  const claws = randomOptionEntry(tableDragonClaws, rollFn).result;
  const bite = randomOptionEntry(tableDragonBite, rollFn).result;
  const tail = randomOptionEntry(tableDragonTail, rollFn).result;
  const lair = randomOptionEntry(tableDragonLair, rollFn).result;
  const specialTreasure =
    rollFn(6) === 1
      ? randomOptionEntry(tableDragonSpecialTreasure, rollFn).result
      : null;

  return {
    name,
    alignment,
    size,
    age,
    breath,
    color,
    strength,
    weakness,
    favoriteFood,
    status,
    stats: {
      hitPoints: dragonHitPoints[age][size],
      armorClass: dragonArmorClass[color],
      savingThrows,
      morale,
    },
    attacks: {
      claws,
      bite,
      tail,
      breathWeapon: 'See your favorite ruleset.',
    },
    lair,
    specialTreasure,
  };
}

export {
  calcDragon,
  tableDragonAge,
  tableDragonAlignment,
  tableDragonBite,
  tableDragonBreath,
  tableDragonClaws,
  tableDragonFavoriteFood,
  tableDragonLair,
  tableDragonMorale,
  tableDragonName,
  tableDragonSavingThrows,
  tableDragonSize,
  tableDragonSpecialTreasure,
  tableDragonStatusDungeon,
  tableDragonStatusWilderness,
  tableDragonStrength,
  tableDragonTail,
  tableDragonWeakness,
  type Dragon,
  type DragonLocation,
};
