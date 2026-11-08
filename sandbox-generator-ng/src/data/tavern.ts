import { d } from '../dice/dice';
import { type RandomTable } from '../domain/random-table';
import { randomOptionEntry } from './data';

type TavernRoll = { roll: number; result: string };
type TavernDrink = TavernRoll & { wine: TavernRoll | null };
type TavernMenuItem = TavernRoll & {
  detail: TavernRoll | null;
  serving: string | null;
};

type Tavern = {
  name: { first: TavernRoll; second: TavernRoll; result: string };
  decorationCountRoll: number;
  decorations: TavernRoll[];
  bartender: { firstTrait: TavernRoll; secondTrait: TavernRoll };
  servers: {
    commonTraitCheck: number;
    commonTrait: TavernRoll | null;
    individualTrait: TavernRoll;
    secondIndividualTrait: TavernRoll | null;
  };
  patrons: { mostCustomers: TavernRoll; specificCustomer: TavernRoll };
  entertainment: TavernRoll;
  activityCountRoll: number;
  activities: TavernRoll[];
  rooms: { bestAvailable: TavernRoll; specialCheck: number; special: TavernRoll | null };
  outsideCountRoll: number;
  outside: TavernRoll[];
  menu: {
    specialsOfTheDay: { mainDish: TavernMenuItem; soup: TavernMenuItem };
    travelersMeal: { snack: TavernMenuItem; soup: TavernMenuItem };
    fullCourseMenu: {
      soup: TavernMenuItem;
      appetizer: TavernMenuItem;
      mainDish: TavernMenuItem;
      dessert: TavernMenuItem;
    };
  };
  rumor: { result: TavernRoll; truthfulness: TavernRoll };
  sign: {
    shape: TavernRoll;
    material: TavernRoll;
    position: TavernRoll;
    mounting: TavernRoll;
    subPanel: TavernRoll;
    subPanelPhrase: TavernRoll | null;
    mainPanelContent: TavernRoll;
    illustration: TavernRoll | null;
    specialFeature: TavernRoll;
  };
};

// Book: Generators > Tavern > 1) Name, pp. 136-137.
const tableTavernNameFirst: RandomTable = {
  id: 327,
  title: 'Tavern Name: First Part',
  dice: '1d100',
  options: {
    1: 'Adventurer(s)',
    2: 'Angry',
    3: 'Big',
    4: 'Black',
    5: 'Bleeding',
    6: 'Blind',
    7: 'Bloody',
    8: 'Blue',
    9: 'Broken',
    10: 'Burlesque',
    11: 'Burly',
    12: 'Burning',
    13: 'Busty',
    14: 'Classy',
    15: 'Cracked',
    16: 'Crazy',
    17: 'Crooked',
    18: 'Cursed',
    19: "Daddy's",
    20: 'Dancing',
    21: 'Dangerous',
    22: 'Dark',
    23: 'Deadly',
    24: 'Deep',
    25: 'Dirty',
    26: 'Divine',
    27: 'Doctor(s)',
    28: 'Dragon(s)',
    29: 'Drinking',
    30: 'Dripping',
    31: 'Drunken',
    32: 'Dwarf(ves)',
    33: 'Elf(ves)',
    34: 'Empty',
    35: 'Enchanted',
    36: 'Fighting',
    37: 'Fireside',
    38: 'Flaming',
    39: 'Fresh',
    40: 'Golden',
    41: 'Green',
    42: 'Grog',
    43: 'Hag(s)',
    44: 'Hanging',
    45: 'Halfling(s)',
    46: 'Happy',
    47: 'Holy',
    48: 'Honest',
    49: 'Horny',
    50: 'Hot',
    51: 'Hungry',
    52: 'Iron',
    53: "Joe's",
    54: 'King(s)',
    55: 'Last',
    56: 'Laughing',
    57: 'Lazy',
    58: 'Lonely',
    59: 'Lovely',
    60: 'Lucky',
    61: 'Magical',
    62: 'Marvelous',
    63: 'Minstrel(s)',
    64: 'Naked',
    65: 'Naughty',
    66: 'Nymph(s)',
    67: 'Oiled',
    68: 'Orc(s)',
    69: 'Peasant(s)',
    70: 'Prince(s)',
    71: 'Puking',
    72: 'Queen(s)',
    73: 'Raging',
    74: 'Red',
    75: 'Rotten',
    76: 'Rusty',
    77: 'Safe',
    78: 'Sailor(s)',
    79: 'Screaming',
    80: 'Sexy',
    81: 'Shiny',
    82: 'Silver',
    83: 'Sleepy',
    84: 'Slimy',
    85: 'Smelly',
    86: 'Smiling',
    87: 'Strange',
    88: 'Sunny',
    89: 'Swearing',
    90: 'Tasty',
    91: 'Thirsty',
    92: 'Thug(s)',
    93: 'Tired',
    94: 'Traveler(s)',
    95: 'Unkempt',
    96: 'Vulgar',
    97: 'Wet',
    98: 'White',
    99: 'Witch(es)',
    100: 'Yawning',
  },
};

const tableTavernNameSecond: RandomTable = {
  id: 328,
  title: 'Tavern Name: Second Part',
  dice: '1d30',
  options: {
    1: 'Bar(maid)',
    2: 'Brew',
    3: 'Brewery',
    4: 'Bucket',
    5: 'Café',
    6: 'Castle',
    7: 'Cauldron',
    8: 'Cavern',
    9: 'Club',
    10: 'Cup',
    11: 'Den',
    12: 'Flask',
    13: 'Hall',
    14: 'Head',
    15: 'Hole',
    16: 'Home',
    17: 'Inn',
    18: 'Keg',
    19: 'Kettle',
    20: 'Lodge',
    21: 'Loft',
    22: 'Lounge',
    23: 'Market',
    24: 'Pub',
    25: 'Rest',
    26: 'Stool',
    27: 'Stop',
    28: 'Tavern',
    29: 'Tower',
    30: 'Wineskin',
  },
};

// Book: Generators > Tavern > 2) Decoration, p. 138.
const tableTavernDecoration: RandomTable = {
  id: 329,
  title: 'Tavern Decoration',
  dice: '1d24',
  options: {
    1: 'Birdhouses',
    2: 'Bookshelves',
    3: 'Carved wood',
    4: 'Draperies',
    5: 'Fishing trophies',
    6: 'Flags (see p. 112)',
    7: 'Furs',
    8: 'Glowing crystals',
    9: 'Hunting trophies',
    10: 'Naughty drawings',
    11: 'Naval themed items',
    12: 'Old tools',
    13: 'Old weapons',
    14: 'Painted plates',
    15: 'Paintings',
    16: 'Plants',
    17: 'Porcelain dolls',
    18: 'Quest/Wanted posters',
    19: 'Shields',
    20: 'Skulls and bones',
    21: 'Stuffed animals',
    22: 'Tapestries',
    23: 'Torture instruments',
    24: 'Trophies',
  },
};

// Book: Generators > Tavern > 3) Bartender, p. 138.
const tableTavernBartenderFirstTrait: RandomTable = {
  id: 330,
  title: 'Tavern Bartender: First Trait',
  dice: '1d20',
  options: {
    1: 'Absent minded',
    2: 'Always complaining',
    3: 'Disturbed',
    4: 'Flirty',
    5: 'Funny',
    6: 'Generous',
    7: 'Good listener',
    8: 'Grumpy',
    9: 'Inquisitive',
    10: 'Jumpy',
    11: 'Loud',
    12: 'Moody',
    13: 'Nice',
    14: 'Playful',
    15: 'Rude',
    16: 'Silent',
    17: 'Talkative',
    18: 'Unpleasant',
    19: 'Welcoming',
    20: 'Worrying',
  },
};

const tableTavernBartenderSecondTrait: RandomTable = {
  id: 331,
  title: 'Tavern Bartender: Second Trait',
  dice: '1d20',
  options: {
    1: 'Always busy',
    2: 'Checks every coin',
    3: 'Cocktail master',
    4: 'Extravagant clothing',
    5: 'Famous in the area',
    6: 'Has a hidden weapon',
    7: 'Has lots of piercings',
    8: 'Knows a few magic tricks',
    9: 'Looking for opportunities',
    10: 'Needs help',
    11: 'Never washes the glasses',
    12: 'Not there at the moment',
    13: 'Older than they seem',
    14: 'Poisons at disposal',
    15: 'Retired adventurer',
    16: 'Stunning',
    17: 'Tattooed from head to toes',
    18: 'Terrible secret',
    19: 'Thick accent',
    20: 'Tipsy',
  },
};

// Book: Generators > Tavern > 4) Servers, p. 139.
const tableTavernServerCommonTrait: RandomTable = {
  id: 332,
  title: 'Tavern Servers: Common Trait',
  dice: '1d10',
  options: {
    1: 'Also work as dancers',
    2: 'Hate/Love each other',
    3: 'Have a weapon',
    4: 'Have the same hair color',
    5: 'Hide their face',
    6: 'Indistinguishable',
    7: 'Orphans',
    8: 'Outfit',
    9: 'Scars',
    10: 'Sisters/Brothers',
  },
};

const tableTavernServerIndividualTrait: RandomTable = {
  id: 333,
  title: 'Tavern Servers: Individual Trait',
  dice: '1d20',
  options: {
    1: 'Adventurer in downtime',
    2: 'Artist',
    3: 'Burnt face',
    4: 'Child of the owner',
    5: 'Debt to repay',
    6: 'Demon waiting for a prey',
    7: 'Gets lots of tips',
    8: 'Has an identical twin',
    9: 'Knows the gossip',
    10: 'Not so young anymore',
    11: 'Pickpockets clients',
    12: 'Prince(ss) in disguise',
    13: 'Sells their body',
    14: 'Single parent',
    15: 'Skilled assassin',
    16: 'Soon to be parent',
    17: 'Student',
    18: 'Tattooed',
    19: 'Unusual outfit',
    20: 'Very cultured',
  },
};

// Book: Generators > Tavern > 5) Patrons, p. 139.
const tableTavernMostCustomers: RandomTable = {
  id: 334,
  title: 'Tavern Patrons: Most Customers',
  dice: '1d12',
  options: {
    1: 'Drunks',
    2: 'Drunks',
    3: 'Commoners',
    4: 'Commoners',
    5: 'Commoners',
    6: 'Commoners',
    7: 'Adventurers',
    8: 'Bandits/Pirates',
    9: 'Guards/Soldiers',
    10: 'Merchants',
    11: 'Nobles',
    12: 'Scholars',
  },
};

const tableTavernSpecificCustomer: RandomTable = {
  id: 335,
  title: 'Tavern Patrons: Specific Customer',
  dice: '1d20',
  options: {
    1: 'Adventurer looking for a party',
    2: 'Courier',
    3: 'Drunk and loud dwarf',
    4: 'Foreign prince(ss)',
    5: 'Highwayman',
    6: 'Halfling dancing on a table',
    7: 'Lycanthrope/Vampire',
    8: 'Man whose table is covered in food',
    9: 'Peasant looking for a retainer job',
    10: 'Pickpocket',
    11: 'Priest(ress)',
    12: 'Recruiter from a guild',
    13: 'Slaver',
    14: 'Someone celebrating their birthday',
    15: 'Someone looking to hire adventurers for a quest',
    16: 'Succubus/Incubus',
    17: 'Tax collector',
    18: 'Three goblins in disguise',
    19: 'Traveler',
    20: 'Vampire hunter',
  },
};

// Book: Generators > Tavern > 6) Entertainment, p. 140.
const tableTavernEntertainers: RandomTable = {
  id: 336,
  title: 'Tavern Entertainers',
  dice: '1d20',
  options: {
    1: 'None',
    2: 'None',
    3: 'None',
    4: 'None',
    5: 'None',
    6: 'Bard',
    7: 'Bard',
    8: 'Bard',
    9: 'Bard',
    10: 'Bard',
    11: 'Bard',
    12: 'Bard',
    13: 'Bard',
    14: 'Dancers',
    15: 'Fortune teller',
    16: 'Humorist',
    17: 'Jester',
    18: 'Magician',
    19: 'Musicians',
    20: 'Poet',
  },
};

const tableTavernActivities: RandomTable = {
  id: 337,
  title: 'Tavern Activities',
  dice: '1d20',
  options: {
    1: 'Arm wrestling',
    2: 'Betting',
    3: 'Billiards',
    4: 'Bingo',
    5: 'Books',
    6: 'Brawls',
    7: 'Cards',
    8: 'Chess',
    9: 'Dancing',
    10: 'Darts throwing',
    11: 'Dice',
    12: 'Dominoes',
    13: 'Drinking games',
    14: 'Eating contest',
    15: 'Fighting ring',
    16: 'Hot bath',
    17: 'Knife throwing',
    18: 'Marbles',
    19: 'Obstacle course',
    20: 'Wheel of fortune',
  },
};

// Book: Generators > Tavern > 7) Rooms, p. 140.
const tableTavernBestRoom: RandomTable = {
  id: 338,
  title: 'Tavern Best Available Room',
  dice: '1d6',
  options: {
    1: 'Suite',
    2: 'Richly decorated and comfortable',
    3: 'Cozy, with a view',
    4: 'Bed, dresser and desk',
    5: 'Creaking bed and table',
    6: 'Mattress and chamber pot',
  },
};

const tableTavernSpecialRoom: RandomTable = {
  id: 339,
  title: 'Tavern Special Room',
  dice: '1d6',
  options: {
    1: 'Badly decorated',
    2: 'Freezing cold',
    3: 'Haunted',
    4: 'Leaking roof',
    5: 'Location of a sinister event',
    6: 'Rat infested',
  },
};

// Book: Generators > Tavern > 8) Outside, p. 141.
const tableTavernOutside: RandomTable = {
  id: 340,
  title: 'Tavern Outside Amenities',
  dice: '1d20',
  options: {
    1: 'Beehives',
    2: 'Carriage stop',
    3: 'Chicken house',
    4: 'Dovecote',
    5: 'Event grounds',
    6: 'Garden',
    7: 'Mailbox',
    8: 'Orchard',
    9: 'Outhouse toilets',
    10: 'Patio',
    11: 'Playground',
    12: 'Pig pen',
    13: 'Pond',
    14: 'Porch',
    15: 'Rainwater barrel',
    16: 'Stables',
    17: 'Tavern products stall',
    18: 'Tent sites',
    19: 'Vegetable patch',
    20: 'Well',
  },
};

// Book: Generators > Tavern > 9) Menu, pp. 141-143.
const tableTavernDrinks: RandomTable = {
  id: 341,
  title: 'Tavern Drinks',
  dice: '1d10',
  options: {
    1: 'Beer',
    2: 'Cocktail',
    3: 'Coconut milk',
    4: 'Coffee',
    5: 'Fruit juice',
    6: 'Hot chocolate',
    7: 'Lemonade',
    8: 'Liquor',
    9: 'Milk',
    10: 'Wine',
  },
};

const tableTavernWine: RandomTable = {
  id: 342,
  title: 'Tavern Wine',
  dice: '1d4',
  options: {
    1: 'Red',
    2: 'Rosé',
    3: 'Sparkling',
    4: 'White',
  },
};

const tableTavernSnacks: RandomTable = {
  id: 343,
  title: 'Tavern Snacks',
  dice: '1d12',
  options: {
    1: 'Cheese & meat platter',
    2: 'Cheese platter',
    3: 'Crisps',
    4: 'Dry sausage',
    5: 'Fried potatoes',
    6: 'Fresh vegetables platter',
    7: 'Hard-boiled eggs and bread',
    8: 'Salad',
    9: 'Salted peanuts',
    10: 'Smoked sausage',
    11: 'Toast, with spread',
    12: 'Vinegar pickles',
  },
};

const tableTavernCheesePlatter: RandomTable = {
  id: 344,
  title: 'Tavern Cheese Platter',
  dice: '1d2',
  options: {
    1: 'Small (3 varieties)',
    2: 'Large (6 varieties)',
  },
};
const tableTavernSalad: RandomTable = {
  id: 345,
  title: 'Tavern Salad',
  dice: '1d2',
  options: {
    1: 'Plain',
    2: 'With dressing',
  },
};
const tableTavernToastSpread: RandomTable = {
  id: 346,
  title: 'Tavern Toast Spread',
  dice: '1d8',
  options: {
    1: 'Butter',
    2: 'Cheese',
    3: 'Fish',
    4: 'Ham',
    5: 'Pâté',
    6: 'Salted butter',
    7: 'Truffle cream',
    8: 'Vegetables',
  },
};

const tableTavernSoups: RandomTable = {
  id: 347,
  title: 'Tavern Soups',
  dice: '1d20',
  options: {
    1: 'Artichoke soup',
    2: 'Asparagus cream',
    3: 'Boar and chestnut',
    4: 'Calamari soup',
    5: 'Carrot soup',
    6: "Chef's soup (carrot, celery, onion and zucchini)",
    7: 'Chicken broth',
    8: 'Chicken cream',
    9: 'Fish soup',
    10: "Granny's soup (carrot, leek, parsley, turnip and zucchini)",
    11: 'Lobster bisque',
    12: 'Minestrone',
    13: 'Mushroom cream',
    14: 'Oyster soup',
    15: 'Parsnip soup',
    16: 'Peas and smoked sausage',
    17: 'Pumpkin cream',
    18: 'Secret soup (carrot, meat broth, onion and potatoes)',
    19: 'Tomato cream',
    20: 'Vegetable broth',
  },
};

const tableTavernAppetizers: RandomTable = {
  id: 348,
  title: 'Tavern Appetizers',
  dice: '1d6',
  options: {
    1: 'Beans casserole',
    2: 'Bacon-wrapped sausage',
    3: 'Cheese croquette',
    4: 'Seafood plate',
    5: 'Terrine',
    6: 'Verrine',
  },
};
const tableTavernTerrine: RandomTable = {
  id: 349,
  title: 'Tavern Terrine',
  dice: '1d6',
  options: {
    1: 'Boar & forest mushrooms',
    2: 'Chicken',
    3: 'Hare',
    4: 'Pork',
    5: 'Vegetables',
    6: 'Zucchini and goat cheese',
  },
};
const tableTavernVerrine: RandomTable = {
  id: 350,
  title: 'Tavern Verrine',
  dice: '1d3',
  options: {
    1: 'Foie gras',
    2: 'Salmon',
    3: 'Vegetables',
  },
};

const tableTavernMainDishes: RandomTable = {
  id: 351,
  title: 'Tavern Main Dishes',
  dice: '1d20',
  options: {
    1: 'Boiled crab',
    2: 'Carbonnade à la bière',
    3: 'Leg of lamb',
    4: 'Lentil “meatloaf”',
    5: 'Meatballs with brown sauce',
    6: 'Meatloaf',
    7: 'Omelet',
    8: 'Quiche',
    9: 'Rabbit pâté',
    10: 'Roast',
    11: 'Royal sausage & choucroute',
    12: 'Sandwich',
    13: 'Sauteed mushrooms',
    14: 'Scrambled eggs',
    15: 'Steak',
    16: 'Stew',
    17: 'Stuffed pâtisson',
    18: 'Stuffed turkey',
    19: 'Venison',
    20: 'Vol-au-vent',
  },
};
const tableTavernOmelet: RandomTable = {
  id: 352,
  title: 'Tavern Omelet',
  dice: '1d3',
  options: {
    1: 'Bacon',
    2: 'Cheese',
    3: 'Fried vegetables',
  },
};
const tableTavernRoast: RandomTable = {
  id: 353,
  title: 'Tavern Roast',
  dice: '1d4',
  options: {
    1: 'Beef',
    2: 'Chicken',
    3: 'Fish',
    4: 'Pork',
  },
};
const tableTavernSandwich: RandomTable = {
  id: 354,
  title: 'Tavern Sandwich',
  dice: '1d6',
  options: {
    1: 'Butter and cheese',
    2: 'Butter and ham',
    3: 'Cheese, tomato slices and salad',
    4: 'Cheese and roasted tomatoes',
    5: 'Fresh vegetables',
    6: 'Tuna and mayonnaise',
  },
};
const tableTavernStew: RandomTable = {
  id: 355,
  title: 'Tavern Stew',
  dice: '1d4',
  options: {
    1: 'Beef',
    2: 'Pork',
    3: 'Rabbit',
    4: 'Veal',
  },
};

const tableTavernDesserts: RandomTable = {
  id: 356,
  title: 'Tavern Desserts',
  dice: '1d10',
  options: {
    1: 'Biscuits',
    2: 'Cake',
    3: 'Cheesecake',
    4: 'Crème',
    5: 'Fruit jelly',
    6: 'Marzipan',
    7: 'Mousse',
    8: 'Pancakes',
    9: 'Pie/Cobbler',
    10: 'Waffle',
  },
};
const tableTavernCreme: RandomTable = {
  id: 357,
  title: 'Tavern Crème',
  dice: '1d4',
  options: {
    1: 'Chocolate',
    2: 'Crème brûlée',
    3: 'Rice',
    4: 'Pudding',
  },
};
const tableTavernMousse: RandomTable = {
  id: 358,
  title: 'Tavern Mousse',
  dice: '1d3',
  options: {
    1: 'Chocolate',
    2: 'Strawberry',
    3: 'Vanilla',
  },
};
const tableTavernPie: RandomTable = {
  id: 359,
  title: 'Tavern Pie/Cobbler',
  dice: '1d5',
  options: {
    1: 'Apple',
    2: 'Cherry',
    3: 'Rice cream',
    4: 'Strawberry',
    5: 'Plum',
  },
};

// Book: Generators > Tavern > 10) Rumors, p. 143.
const tableTavernRumors: RandomTable = {
  id: 360,
  title: 'Tavern Rumors',
  dice: '1d20',
  options: {
    1: 'A dead body was found near the river, disfigured.',
    2: 'A fearless bear has emptied the cellar of several houses.',
    3: 'A treasure chest buried in the forest.',
    4: 'A wild child lives in the woods.',
    5: 'A witch-hunter terrifies old women and midwives.',
    6: 'Bandits have been more aggressive recently.',
    7: 'Children have gone missing.',
    8: 'Dead are restless at night.',
    9: 'Goblins are scheming something.',
    10: 'Last night, there were flying lights in the sky.',
    11: 'Nowadays, demons conclude pacts more and more often.',
    12: 'Some calves are born with two heads.',
    13: 'Someone important is coming to the village.',
    14: 'Someone is having an affair.',
    15: 'Someone with a bounty on their head is hiding nearby.',
    16: 'The bartender pisses in the beer.',
    17: 'The hunter hides something.',
    18: 'The village well is bottomless.',
    19: 'There is a dungeon under the village.',
    20: 'They are hiring in the military.',
  },
};

const tableTavernRumorTruthfulness: RandomTable = {
  id: 361,
  title: 'Tavern Rumor Truthfulness',
  dice: '1d6',
  options: {
    1: 'True',
    2: 'True',
    3: 'Not false, but not true either',
    4: 'Not false, but not true either',
    5: 'False',
    6: 'False',
  },
};

// Book: Generators > Tavern > 11) Sign, pp. 144-145.
const tableTavernSignShape: RandomTable = {
  id: 362,
  title: 'Tavern Sign Shape',
  dice: '1d20',
  options: {
    1: 'Oval',
    2: 'Oval',
    3: 'Oval',
    4: 'Oval',
    5: 'Round',
    6: 'Round',
    7: 'Round',
    8: 'Round',
    9: 'Square',
    10: 'Square',
    11: 'Square',
    12: 'Square',
    13: 'Rectangle',
    14: 'Rectangle',
    15: 'Rectangle',
    16: 'Rectangle',
    17: 'Banner',
    18: 'Banner',
    19: 'Shield',
    20: 'Tankard',
  },
};

const tableTavernSignMaterial: RandomTable = {
  id: 363,
  title: 'Tavern Sign Material',
  dice: '1d12',
  options: {
    1: 'Wood',
    2: 'Wood',
    3: 'Wood',
    4: 'Wrought iron',
    5: 'Wrought iron',
    6: 'Wrought iron',
    7: 'Drift wood',
    8: 'Drift wood',
    9: 'Stained glass',
    10: 'Stained glass',
    11: 'Glass',
    12: 'Stone',
  },
};

const tableTavernSignPosition: RandomTable = {
  id: 364,
  title: 'Tavern Sign Position',
  dice: '1d20',
  options: {
    1: 'On the facade',
    2: 'On the facade',
    3: 'On the facade',
    4: 'On the facade',
    5: 'On the facade',
    6: 'Perpendicular to the facade',
    7: 'Perpendicular to the facade',
    8: 'Perpendicular to the facade',
    9: 'Perpendicular to the facade',
    10: 'Perpendicular to the facade',
    11: 'Above the door',
    12: 'Above the door',
    13: 'Above the door',
    14: 'Above the door',
    15: 'On a pole',
    16: 'On a pole',
    17: 'On a pole',
    18: 'On a low wall',
    19: 'On a fence',
    20: 'On the roof',
  },
};

const tableTavernSignMounting: RandomTable = {
  id: 365,
  title: 'Tavern Sign Mounting',
  dice: '1d8',
  options: {
    1: 'Iron studs',
    2: 'Iron studs',
    3: 'Iron studs',
    4: 'Wrought iron structure',
    5: 'Wrought iron structure',
    6: 'Wrought iron structure',
    7: 'Wooden structure',
    8: 'Wooden structure',
  },
};

const tableTavernSignSubPanel: RandomTable = {
  id: 366,
  title: 'Tavern Sign Sub-panel',
  dice: '1d12',
  options: {
    1: 'No sub-panel',
    2: 'No sub-panel',
    3: 'No sub-panel',
    4: 'Catchphrase',
    5: 'Catchphrase',
    6: 'Catchphrase',
    7: "Owner(s) name(s)",
    8: "Owner(s) name(s)",
    9: 'Menu',
    10: 'Menu',
    11: 'Motto',
    12: 'Joke',
  },
};

const tableTavernSignCatchphrase: RandomTable = {
  id: 367,
  title: 'Tavern Sign Catchphrase',
  dice: '1d12',
  options: {
    1: 'Since ...',
    2: 'Best ... in town',
    3: 'Family Business',
    4: 'Royal supplier',
    5: 'Bed and breakfast',
    6: 'Come in',
    7: 'No ... allowed',
    8: 'Branch of ...',
    9: 'Pharmacy',
    10: 'Welcome',
    11: 'Endorsed by ...',
    12: 'Pets welcome',
  },
};

const tableTavernSignMainPanel: RandomTable = {
  id: 368,
  title: 'Tavern Sign Main Panel Content',
  dice: '1d12',
  options: {
    1: 'Tavern name',
    2: 'Tavern name',
    3: 'Tavern name',
    4: 'Tavern name',
    5: 'Tavern name+illustration',
    6: 'Tavern name+illustration',
    7: 'Tavern name+illustration',
    8: 'Tavern name+illustration',
    9: '“Inn”/“Hostel”/“Tavern”',
    10: '“Inn”/“Hostel”/“Tavern”',
    11: 'Illustration',
    12: 'Owner(s) initial(s)',
  },
};

const tableTavernSignIllustration: RandomTable = {
  id: 369,
  title: 'Tavern Sign Illustrations',
  dice: '1d100',
  options: {
    1: 'Anchor',
    2: 'Anchor',
    3: 'Angel',
    4: 'Angel',
    5: 'Boar/Pig',
    6: 'Boar/Pig',
    7: 'Bottle',
    8: 'Bottle',
    9: 'Brand logo',
    10: 'Brand logo',
    11: 'Cheese',
    12: 'Cheese',
    13: 'Chicken',
    14: 'Chicken',
    15: 'Coat of arms',
    16: 'Coat of arms',
    17: 'Crow',
    18: 'Crow',
    19: 'Crown',
    20: 'Crown',
    21: 'Cutlery',
    22: 'Cutlery',
    23: 'Dog/Wolf',
    24: 'Dog/Wolf',
    25: 'Dragon',
    26: 'Dragon',
    27: 'Drunk person',
    28: 'Drunk person',
    29: 'Eagle',
    30: 'Eagle',
    31: 'Face',
    32: 'Face',
    33: 'Fire',
    34: 'Fire',
    35: 'Fish',
    36: 'Fish',
    37: 'Fishing hook',
    38: 'Fishing hook',
    39: 'Flowers',
    40: 'Flowers',
    41: 'Fountain',
    42: 'Fountain',
    43: 'Fox',
    44: 'Fox',
    45: 'Frog',
    46: 'Frog',
    47: 'Gallows',
    48: 'Gallows',
    49: 'Goose',
    50: 'Goose',
    51: 'Grape',
    52: 'Grape',
    53: 'Griffin',
    54: 'Griffin',
    55: 'Hare',
    56: 'Hare',
    57: 'Heart',
    58: 'Heart',
    59: 'Hearth',
    60: 'Hearth',
    61: 'Honeybee',
    62: 'Honeybee',
    63: 'Horse/Pony/Unicorn',
    64: 'Horse/Pony/Unicorn',
    65: 'Horseshoe',
    66: 'Horseshoe',
    67: 'Jester',
    68: 'Jester',
    69: 'Knight',
    70: 'Knight',
    71: 'Kraken',
    72: 'Kraken',
    73: 'Lion',
    74: 'Lion',
    75: 'Manticore',
    76: 'Manticore',
    77: 'Mascot',
    78: 'Mascot',
    79: 'Monster head',
    80: 'Monster head',
    81: 'Mouse/Rat',
    82: 'Mouse/Rat',
    83: 'Pinup',
    84: 'Pinup',
    85: 'Pirate',
    86: 'Pirate',
    87: 'Potion',
    88: 'Potion',
    89: 'Sailor',
    90: 'Sailor',
    91: 'Ship',
    92: 'Ship',
    93: 'Skull',
    94: 'Skull',
    95: 'Stag',
    96: 'Stag',
    97: 'Tree',
    98: 'Tree',
    99: 'Wizard',
    100: 'Wizard',
  },
};

const tableTavernSignSpecialFeature: RandomTable = {
  id: 370,
  title: 'Tavern Sign Special Feature',
  dice: '1d20',
  options: {
    1: 'Nothing special',
    2: 'Nothing special',
    3: 'Nothing special',
    4: 'Nothing special',
    5: 'Nothing special',
    6: 'Nothing special',
    7: 'Nothing special',
    8: 'Nothing special',
    9: 'Nothing special',
    10: 'Nothing special',
    11: 'Nothing special',
    12: 'Nothing special',
    13: 'Bug trap',
    14: 'Clock',
    15: 'Decorative moldings/gilding',
    16: 'Glows in the dark',
    17: 'Lamp',
    18: 'Magically animated',
    19: 'Decorative hanging barrel/tankard',
    20: 'Windmill',
  },
};

const tavernRandomTables: RandomTable[] = [
  tableTavernNameFirst, tableTavernNameSecond, tableTavernDecoration, tableTavernBartenderFirstTrait,
  tableTavernBartenderSecondTrait, tableTavernServerCommonTrait, tableTavernServerIndividualTrait,
  tableTavernMostCustomers, tableTavernSpecificCustomer, tableTavernEntertainers, tableTavernActivities,
  tableTavernBestRoom, tableTavernSpecialRoom, tableTavernOutside, tableTavernDrinks, tableTavernWine,
  tableTavernSnacks, tableTavernCheesePlatter, tableTavernSalad, tableTavernToastSpread, tableTavernSoups,
  tableTavernAppetizers, tableTavernTerrine, tableTavernVerrine, tableTavernMainDishes, tableTavernOmelet,
  tableTavernRoast, tableTavernSandwich, tableTavernStew, tableTavernDesserts, tableTavernCreme,
  tableTavernMousse, tableTavernPie, tableTavernRumors, tableTavernRumorTruthfulness, tableTavernSignShape,
  tableTavernSignMaterial, tableTavernSignPosition, tableTavernSignMounting, tableTavernSignSubPanel,
  tableTavernSignCatchphrase, tableTavernSignMainPanel, tableTavernSignIllustration,
  tableTavernSignSpecialFeature,
];

function rollEntry(table: RandomTable, rollFn: (faces: number) => number): TavernRoll {
  const entry = randomOptionEntry(table, rollFn);
  return { roll: entry.key, result: entry.result };
}

function rollMany(table: RandomTable, count: number, rollFn: (faces: number) => number): TavernRoll[] {
  return Array.from({ length: count }, () => rollEntry(table, rollFn));
}

function rollMenuItem(
  table: RandomTable,
  rollFn: (faces: number) => number,
  nested?: Record<number, RandomTable>,
  serving?: Record<number, string>,
): TavernMenuItem {
  const item = rollEntry(table, rollFn);
  const nestedTable = nested?.[item.roll];
  return {
    ...item,
    detail: nestedTable ? rollEntry(nestedTable, rollFn) : null,
    serving: serving?.[item.roll] ?? null,
  };
}

function rollTavernDrink(rollFn: (faces: number) => number = d): TavernDrink {
  const drink = rollEntry(tableTavernDrinks, rollFn);
  if (drink.result !== 'Wine') {
    return { ...drink, wine: null };
  }
  const wine = rollEntry(tableTavernWine, rollFn);
  return { ...drink, wine };
}

function calcTavern(
  options: {
    includeSecondServerTrait?: boolean;
    rollFn?: (faces: number) => number;
  } = {},
): Tavern {
  const rollFn = options.rollFn ?? d;
  const nameFirst = rollEntry(tableTavernNameFirst, rollFn);
  const nameSecond = rollEntry(tableTavernNameSecond, rollFn);
  const decorationCountRoll = rollFn(2);
  const decorations = rollMany(tableTavernDecoration, decorationCountRoll, rollFn);
  const bartender = {
    firstTrait: rollEntry(tableTavernBartenderFirstTrait, rollFn),
    secondTrait: rollEntry(tableTavernBartenderSecondTrait, rollFn),
  };
  const commonTraitCheck = rollFn(6);
  const commonTrait = commonTraitCheck === 1 ? rollEntry(tableTavernServerCommonTrait, rollFn) : null;
  const servers = {
    commonTraitCheck,
    commonTrait,
    individualTrait: rollEntry(tableTavernServerIndividualTrait, rollFn),
    secondIndividualTrait: options.includeSecondServerTrait
      ? rollEntry(tableTavernBartenderFirstTrait, rollFn)
      : null,
  };
  const patrons = {
    mostCustomers: rollEntry(tableTavernMostCustomers, rollFn),
    specificCustomer: rollEntry(tableTavernSpecificCustomer, rollFn),
  };
  const entertainment = rollEntry(tableTavernEntertainers, rollFn);
  const activityCountRoll = rollFn(3);
  const activities = rollMany(tableTavernActivities, activityCountRoll, rollFn);
  const bestAvailable = rollEntry(tableTavernBestRoom, rollFn);
  const specialCheck = rollFn(6);
  const rooms = {
    bestAvailable,
    specialCheck,
    special: specialCheck === 1 ? rollEntry(tableTavernSpecialRoom, rollFn) : null,
  };
  const outsideCountRoll = rollFn(3);
  const outside = rollMany(tableTavernOutside, outsideCountRoll, rollFn);

  const soup = () => rollMenuItem(tableTavernSoups, rollFn);
  const mainDish = () => rollMenuItem(
    tableTavernMainDishes,
    rollFn,
    { 7: tableTavernOmelet, 10: tableTavernRoast, 12: tableTavernSandwich, 16: tableTavernStew },
    {
      1: 'Served with fried potatoes or mashed potatoes, and salad.',
      2: 'Served with fried potatoes or mashed potatoes, and salad.',
      3: 'Served with fried potatoes or mashed potatoes, and salad.',
      4: 'Served with fried potatoes or mashed potatoes, and salad.',
      5: 'Served with fried potatoes or mashed potatoes, and salad.',
      6: 'Served with fried potatoes or mashed potatoes, and salad.',
      7: 'Served with toast and salad.',
      9: 'Served with fried potatoes or mashed potatoes, and salad.',
      10: 'Served with fried potatoes or mashed potatoes, and salad.',
      13: 'Served with fried potatoes or mashed potatoes, and salad.',
      14: 'Served with toast and salad.',
      15: 'Served with fried potatoes or mashed potatoes, and salad.',
      16: 'Served with fried potatoes or mashed potatoes, and salad.',
      18: 'Served with fried potatoes or mashed potatoes, and salad.',
      19: 'Served with fried potatoes or mashed potatoes, and salad.',
      20: 'Served with fried potatoes or mashed potatoes, and salad.',
    },
  );
  const appetizer = () => rollMenuItem(
    tableTavernAppetizers, rollFn, { 5: tableTavernTerrine, 6: tableTavernVerrine },
  );
  const snack = () => rollMenuItem(
    tableTavernSnacks,
    rollFn,
    { 2: tableTavernCheesePlatter, 8: tableTavernSalad, 11: tableTavernToastSpread },
  );
  const dessert = () => rollMenuItem(
    tableTavernDesserts,
    rollFn,
    { 4: tableTavernCreme, 7: tableTavernMousse, 9: tableTavernPie },
  );

  const rumor = {
    result: rollEntry(tableTavernRumors, rollFn),
    truthfulness: rollEntry(tableTavernRumorTruthfulness, rollFn),
  };
  const signShape = rollEntry(tableTavernSignShape, rollFn);
  const signMaterial = rollEntry(tableTavernSignMaterial, rollFn);
  const signPosition = rollEntry(tableTavernSignPosition, rollFn);
  const signMounting = rollEntry(tableTavernSignMounting, rollFn);
  const subPanel = rollEntry(tableTavernSignSubPanel, rollFn);
  const subPanelPhrase = subPanel.result === 'Catchphrase'
    ? rollEntry(tableTavernSignCatchphrase, rollFn)
    : null;
  const mainPanelContent = rollEntry(tableTavernSignMainPanel, rollFn);
  const illustration = mainPanelContent.result === 'Illustration'
    ? rollEntry(tableTavernSignIllustration, rollFn)
    : null;
  const sign = {
    shape: signShape,
    material: signMaterial,
    position: signPosition,
    mounting: signMounting,
    subPanel,
    subPanelPhrase,
    mainPanelContent,
    illustration,
    specialFeature: rollEntry(tableTavernSignSpecialFeature, rollFn),
  };

  return {
    name: { first: nameFirst, second: nameSecond, result: `${nameFirst.result} ${nameSecond.result}` },
    decorationCountRoll,
    decorations,
    bartender,
    servers,
    patrons,
    entertainment,
    activityCountRoll,
    activities,
    rooms,
    outsideCountRoll,
    outside,
    menu: {
      specialsOfTheDay: { mainDish: mainDish(), soup: soup() },
      travelersMeal: { snack: snack(), soup: soup() },
      fullCourseMenu: { soup: soup(), appetizer: appetizer(), mainDish: mainDish(), dessert: dessert() },
    },
    rumor,
    sign,
  };
}

export {
  calcTavern,
  rollTavernDrink,
  tavernRandomTables,
  type Tavern,
  type TavernDrink,
  type TavernRoll,
  type TavernMenuItem,
};
