import { d } from '../dice/dice';
import { type RandomTable } from '../domain/random-table';
import { randomOptionEntry } from './data';

type Npc = {
  firstName: string;
  surname: string;
  name: string;
  occupation: string;
  appearance: {
    clothes: string;
    particularity: string;
  };
  attitude: string;
  favoriteThing: string;
  dream: string;
  hobby: string;
  secret: string | null;
  relationships: string[];
};

const tableNpcFirstName: RandomTable = {
  id: 180,
  title: 'NPC First Name',
  dice: '1d20',
  options: {
    1: 'Ann',
    2: 'Arthur',
    3: 'Bella',
    4: 'Cecilia',
    5: 'David',
    6: 'Dina',
    7: 'Eliza',
    8: 'Finn',
    9: 'Georg',
    10: 'Hank',
    11: 'Helen',
    12: 'Ingol',
    13: 'John',
    14: 'Lilly',
    15: 'Mona',
    16: 'Olov',
    17: 'Sophie',
    18: 'Thomas',
    19: 'Tisha',
    20: 'Will',
  },
};

const tableNpcSurname: RandomTable = {
  id: 181,
  title: 'NPC Surname',
  dice: '1d20',
  options: {
    1: 'Briggs',
    2: 'Burrows',
    3: 'Button',
    4: 'Cray',
    5: 'Flint',
    6: 'Gibbs',
    7: 'Griffith',
    8: 'Hartley',
    9: 'Head',
    10: 'Hook',
    11: 'Lloyd',
    12: 'Moore',
    13: 'Poole',
    14: 'Powell',
    15: 'Quinn',
    16: 'Robinson',
    17: 'Shaw',
    18: 'Smith',
    19: 'Taylor',
    20: 'Wright',
  },
};

const tableNpcOccupation: RandomTable = {
  id: 182,
  title: 'NPC Occupation',
  dice: '1d100',
  options: {
    1: 'Accountant',
    2: 'Actor',
    3: 'Adventurer',
    4: 'Alchemist',
    5: 'Apothecary',
    6: 'Armorer',
    7: 'Baker',
    8: 'Banker',
    9: 'Barber',
    10: 'Beekeeper',
    11: 'Beggar',
    12: 'Blacksmith',
    13: 'Bookmaker',
    14: 'Bounty hunter',
    15: 'Brewer/Winemaker',
    16: 'Burglar',
    17: 'Business owner',
    18: 'Butcher',
    19: 'Butler/Maid',
    20: 'Carpenter',
    21: 'Cartographer',
    22: 'Charlatan',
    23: 'Clerck',
    24: 'Cook',
    25: 'Copyist',
    26: 'Courier',
    27: 'Dancer',
    28: 'Deserter',
    29: 'Diplomat',
    30: 'Doctor',
    31: 'Druid',
    32: 'Engineer',
    33: 'Escaped slave',
    34: 'Executioner',
    35: 'Exorcist',
    36: 'Falconer',
    37: 'Farmer',
    38: 'Fence',
    39: 'Fisher',
    40: 'Forger',
    41: 'Fugitive',
    42: 'Gravekeeper',
    43: 'Guard',
    44: 'Guild member (see pp. 125-129)',
    45: 'Horse breeder',
    46: 'Housewife/Househusband',
    47: 'Hunter',
    48: 'Inquisitor',
    49: 'Jester',
    50: 'Jeweler',
    51: 'Judge',
    52: 'Knight errant',
    53: 'Librarian',
    54: 'Loan shark',
    55: 'Locksmith',
    56: 'Lumberjack',
    57: 'Mason',
    58: 'Mercenary',
    59: 'Merchant',
    60: 'Messenger',
    61: 'Midwife',
    62: 'Miller',
    63: 'Miner',
    64: 'Minstrel',
    65: 'Missionary',
    66: 'Moneylender',
    67: 'Monk',
    68: 'Mortician',
    69: 'Musician',
    70: 'Noble',
    71: 'Notary',
    72: 'Nurse',
    73: 'Painter',
    74: 'Pickpocket',
    75: 'Pilgrim',
    76: 'Poacher',
    77: 'Potter',
    78: 'Priest',
    79: 'Prince(ss)',
    80: 'Prostitute',
    81: 'Refugee',
    82: 'Saddler',
    83: 'Sailor',
    84: 'Scavenger',
    85: 'Scribe',
    86: 'Sculptor',
    87: 'Shepherd',
    88: 'Smuggler',
    89: 'Soldier',
    90: 'Spy',
    91: 'Squire',
    92: 'Stablehand',
    93: 'Stonecutter',
    94: 'Tattooist',
    95: 'Tavern employee',
    96: 'Tax collector',
    97: 'Teacher',
    98: 'Translator',
    99: 'Trapper',
    100: 'Writer',
  },
};

const tableNpcClothes: RandomTable = {
  id: 183,
  title: 'NPC Clothes',
  dice: '1d8',
  options: {
    1: 'Dirty',
    2: 'Neglected',
    3: 'Neglected',
    4: 'Neutral',
    5: 'Neutral',
    6: 'Groomed',
    7: 'Groomed',
    8: 'Flamboyant',
  },
};

const tableNpcParticularity: RandomTable = {
  id: 184,
  title: 'NPC Particularity',
  dice: '1d10',
  options: {
    1: 'None',
    2: 'None',
    3: 'None',
    4: 'None',
    5: 'None',
    6: 'Eccentric hairstyle',
    7: 'Piercings',
    8: 'Rare eye color',
    9: 'Scar(s)',
    10: 'Tattoo(s)',
  },
};

const tableNpcAttitude: RandomTable = {
  id: 185,
  title: 'NPC Attitude',
  dice: '1d12',
  options: {
    1: 'Aggressive',
    2: 'Apathetic',
    3: 'Cheerful',
    4: 'Condescending',
    5: 'Confident',
    6: 'Depressed',
    7: 'Friendly',
    8: 'Neutral',
    9: 'Outgoing',
    10: 'Secretive',
    11: 'Seductive',
    12: 'Submissive',
  },
};

const tableNpcFavoriteThing: RandomTable = {
  id: 186,
  title: 'NPC Favorite Thing',
  dice: '1d12',
  options: {
    1: 'None',
    2: 'Book',
    3: 'Clothes/Cape/Hat',
    4: 'Flowers',
    5: 'Food',
    6: 'House',
    7: 'Keepsake',
    8: 'Money',
    9: 'Music instrument',
    10: 'Pet',
    11: 'Piece of jewelry',
    12: 'Weapon',
  },
};

const tableNpcDream: RandomTable = {
  id: 187,
  title: 'NPC Dream',
  dice: '1d20',
  options: {
    1: 'None',
    2: 'Becoming an adventurer',
    3: 'Being famous',
    4: 'Being powerful',
    5: 'Being respected',
    6: 'Being rich',
    7: 'Being self-sufficient',
    8: 'Bringing peace to the world',
    9: 'Buying a big property',
    10: 'Changing of occupation',
    11: 'Discovering something new',
    12: 'Dominating others',
    13: 'Finding true love',
    14: 'Helping others',
    15: 'Living a peaceful life',
    16: 'Living elsewhere',
    17: 'Organizing an event',
    18: 'Starting a family',
    19: 'Touring the world',
    20: 'Writing a book/their memoirs',
  },
};

const tableNpcHobby: RandomTable = {
  id: 188,
  title: 'NPC Hobby',
  dice: '1d20',
  options: {
    1: 'None',
    2: 'Camping',
    3: 'Collecting',
    4: 'Cooking',
    5: 'Drawing',
    6: 'Embroidery',
    7: 'Flea markets',
    8: 'Fishing',
    9: 'Gambling',
    10: 'Gardening',
    11: 'Hiking',
    12: 'Hunting',
    13: 'Music',
    14: 'Painting',
    15: 'Partying',
    16: 'Reading',
    17: 'Sewing',
    18: 'Sports',
    19: 'Traveling',
    20: 'Woodworking',
  },
};

const tableNpcSecret: RandomTable = {
  id: 189,
  title: 'NPC Secret',
  dice: '1d12',
  options: {
    1: 'Has a dark past',
    2: 'Has a huge debt',
    3: 'Has an addiction',
    4: 'Has an affair',
    5: 'Has questionable connections',
    6: "Has stolen someone's identity",
    7: 'Has stolen something',
    8: 'Hides an illness/mutation',
    9: 'Is from a (very) rich family',
    10: 'Is part of a secret organization',
    11: 'Was adopted',
    12: 'Was once kidnapped/abducted',
  },
};

const tableNpcRelationship: RandomTable = {
  id: 190,
  title: 'NPC Relationship with Peers',
  dice: '1d20',
  options: {
    1: 'Neutral',
    2: 'Neutral',
    3: 'Neutral',
    4: 'Neutral',
    5: 'Neutral',
    6: 'Neutral',
    7: 'Neutral',
    8: 'Neutral',
    9: 'Neutral',
    10: 'Neutral',
    11: 'Bad reputation',
    12: 'Bullied',
    13: 'Confidant',
    14: 'Feared',
    15: 'Ignored',
    16: 'Loved',
    17: 'Misunderstood',
    18: 'Outsider',
    19: 'Popular',
    20: 'Trusted',
  },
};

/**
 * Generates an NPC from the 2023 edition Generators chapter (p. 132-135).
 *
 * Dream, hobby, and peer relationship are always rolled here; the book marks
 * dream and hobby as optional and lets the DM roll peers as many times as
 * needed. The caller can ignore or reroll those fields.
 */
function calcNpc(rollFn: (faces: number) => number = d): Npc {
  const firstName = randomOptionEntry(tableNpcFirstName, rollFn).result;
  const surname = randomOptionEntry(tableNpcSurname, rollFn).result;
  const occupation = randomOptionEntry(tableNpcOccupation, rollFn).result;
  const clothes = randomOptionEntry(tableNpcClothes, rollFn).result;
  const particularity =
    randomOptionEntry(tableNpcParticularity, rollFn).result;
  const attitude = randomOptionEntry(tableNpcAttitude, rollFn).result;
  const favoriteThing =
    randomOptionEntry(tableNpcFavoriteThing, rollFn).result;
  const dream = randomOptionEntry(tableNpcDream, rollFn).result;
  const hobby = randomOptionEntry(tableNpcHobby, rollFn).result;
  const secret =
    rollFn(6) === 1
      ? randomOptionEntry(tableNpcSecret, rollFn).result
      : null;
  const relationships = [
    randomOptionEntry(tableNpcRelationship, rollFn).result,
  ];

  return {
    firstName,
    surname,
    name: `${firstName} ${surname}`,
    occupation,
    appearance: {
      clothes,
      particularity,
    },
    attitude,
    favoriteThing,
    dream,
    hobby,
    secret,
    relationships,
  };
}

export {
  calcNpc,
  tableNpcAttitude,
  tableNpcClothes,
  tableNpcDream,
  tableNpcFavoriteThing,
  tableNpcFirstName,
  tableNpcHobby,
  tableNpcOccupation,
  tableNpcParticularity,
  tableNpcRelationship,
  tableNpcSecret,
  tableNpcSurname,
  type Npc,
};
