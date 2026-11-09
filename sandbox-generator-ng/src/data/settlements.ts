import { d } from '../dice/dice';
import { RandomTable } from '../domain/random-table';
import { oppositeOptionEntry, randomOptionEntry } from './data';
import { generateRandomName } from './names';

const tableHamletMainBuilding: RandomTable = {
  id: 51,
  title: 'Hamlet Main Building',
  options: {
    1: 'Brewery/Vineyard',
    2: 'Chapel',
    3: 'Farm/Ranch',
    4: 'Manor',
    5: 'Mill',
    6: 'Mine',
    7: 'Sawmill',
    8: 'Shop',
    9: 'Tavern',
    10: 'Toll',
    11: 'Tourney grounds',
    12: 'Watchtower',
  },
};
const tableHamletLayout: RandomTable = {
  id: 52,
  title: 'Hamlet Layout',
  options: {
    1: 'Heap',
    2: 'Round',
    3: 'Row',
  },
};
const tableHamletDisposition: RandomTable = {
  id: 53,
  title: 'Hamlet Disposition',
  dice: '2d6',
  options: {
    2: 'Attack on sight',
    3: 'Hostile',
    4: 'Hostile',
    5: 'Hostile',
    6: 'Neutral',
    7: 'Neutral',
    8: 'Neutral',
    9: 'Welcoming',
    10: 'Welcoming',
    11: 'Welcoming',
    12: 'Enthusiastic',
  },
};
const tableHamletSecret: RandomTable = {
  id: 54,
  title: 'Hamlet Secret',
  options: {
    1: 'Cannibals',
    2: 'Cultists',
    3: 'Dopplegangers',
    4: 'Inbred',
    5: 'Murderers',
    6: 'Lycanthropes/Vampires',
  },
};
const tableHamletHasSecret: RandomTable = {
  id: 541,
  title: 'Hamlet has Secret',
  options: {
    1: 'Yes',
    2: 'No',
    3: 'No',
    4: 'No',
    5: 'No',
    6: 'No',
  },
};
function calcHamlet(rollFn: (faces: number) => number = d) {
  const name = generateRandomName();
  const buildings = {
    mainBuilding: randomOptionEntry(tableHamletMainBuilding, rollFn),
    peasantHouses: rollFn(6) - 1,
  };
  const layout = randomOptionEntry(tableHamletLayout, rollFn);
  const disposition = randomOptionEntry(tableHamletDisposition, rollFn);
  const hasSecret = randomOptionEntry(tableHamletHasSecret, rollFn).result === 'Yes';
  const secret = hasSecret ? randomOptionEntry(tableHamletSecret, rollFn) : null;
  return { name, buildings, layout, disposition, secret };
}

/**
 * Small: 50
 * Medium: 100
 * Big: 150
 */
const tableVillageSize: RandomTable = {
  id: 55,
  title: 'Village Size',
  options: {
    1: 'Medium',
    2: 'Medium',
    3: 'Medium',
    4: 'Small',
    5: 'Small',
    6: 'Big',
  },
};
const tableVillageHasOccupation: RandomTable = {
  id: 561,
  title: 'Village has Occupation',
  options: {
    1: 'Yes',
    2: 'No',
    3: 'No',
    4: 'No',
    5: 'No',
    6: 'No',
  },
};
const tableVillageOccupation: RandomTable = {
  id: 56,
  title: 'Village Occupation',
  options: {
    1: 'Brewing (breweries) or Viticulture (vineyards)',
    2: 'Fishing (fisheries)',
    3: 'Hunting (tanneries)',
    4: 'Logging (sawmills)',
    5: 'Mining (mines)',
    6: 'Pottery (workshops)',
  },
};
const tableVillageLayout: RandomTable = {
  id: 57,
  title: 'Village Layout',
  options: {
    1: 'Heap',
    2: 'Round',
    3: 'Row',
  },
};
const villageGeneralLocations = ['Blacksmith', 'Market', 'Tavern', 'Well'];
/**
 * Roll 1d20 as many times as the village size
 */
const tableVillagePointsOfInterest: RandomTable = {
  id: 58,
  title: 'Village Points of Interest',
  options: {
    1: 'Abandoned building',
    2: 'Apothecary',
    3: 'Bakery',
    4: 'Burnt/Ruined building',
    5: 'Butcher',
    6: 'Castle-farm',
    7: 'Church',
    8: 'Famous person’s house',
    9: 'General store',
    10: 'Graveyard',
    11: 'Guard post',
    12: 'Guildhouse',
    13: 'Gypsy wagon',
    14: 'Horse stables',
    15: 'Library',
    16: 'Mill',
    17: 'Monument/Memorial',
    18: 'Orchard',
    19: 'School',
    20: 'Tailor',
  }
};
/**
 * Roll 1d8 as many times as the village size
 */
const tableVillageDefenses: RandomTable = {
  id: 59,
  title: 'Village Defenses',
  options: {
    1: 'Wooden palisade',
    2: 'Wooden palisade',
    3: 'Wooden palisade',
    4: 'Motte (= mound)',
    5: 'Motte (= mound)',
    6: 'Chevaux de frise',
    7: 'Moat (= trench)',
    8: 'Watchtowers',
  },
};
// Guards: Roll 1d3+3 and multiply by the village size
const tableVillageDisposition: RandomTable = {
  id: 60,
  title: 'Village Disposition',
  dice: '2d6',
  options: {
    2: 'Attack on sight',
    3: 'Hostile',
    4: 'Hostile',
    5: 'Hostile',
    6: 'Neutral',
    7: 'Neutral',
    8: 'Neutral',
    9: 'Welcoming',
    10: 'Welcoming',
    11: 'Welcoming',
    12: 'Enthusiastic',
  },
};
const tableVillageRulerDisposition: RandomTable = {
  id: 61,
  title: 'Village Ruler\'s Disposition',
  options: {
    1: 'Same as villagers',
    2: 'Same as villagers',
    3: 'Same as villagers',
    4: 'Same as villagers',
    5: 'Opposite',
    6: 'Opposite',
  },
};
const tableVillageRulerDispositionIfVillageDispositionNeutral: RandomTable = {
  id: 611,
  title: 'Village Ruler\'s Disposition if Village Disposition is Neutral',
  options: {
    1: 'Hostile',
    2: 'Hostile',
    3: 'Hostile',
    4: 'Welcoming',
    5: 'Welcoming',
    6: 'Welcoming',
  },
};
/**
 * Roll 1d20 as many times as the village size
 */
const tableVillageNotableNpcs: RandomTable = {
  id: 61,
  title: 'Village People',
  options: {
    1: 'Aggressive guard',
    2: 'Annoying minstrel',
    3: 'Bandit in disguise',
    4: 'Beggar who knows a lot',
    5: 'Curious waitress',
    6: 'Cute dog',
    7: 'Frightened peasant',
    8: 'Lonely widow',
    9: 'Misunderstood witch',
    10: 'Old fool/hag',
    11: 'One-handed lumberjack',
    12: 'Retired mercenary',
    13: 'Seasoned adventurer',
    14: 'Sick child',
    15: 'Stubborn magician',
    16: 'Talented craftsman',
    17: 'Traveling merchant',
    18: 'Troubled hunter',
    19: 'Vampire/Werewolf hunter',
    20: 'Village idiot',
  },
};
const tableVillageRuler: RandomTable = {
  id: 62,
  title: 'Village Ruler',
  options: {
    1: 'Bandits',
    2: 'Council',
    3: 'Lycanthrope',
    4: 'Mayor',
    5: 'Merchant',
    6: 'Priest',
    7: 'Village elder',
    8: 'Witch',
  },
};
const tableVillageHasSecret: RandomTable = {
  id: 63,
  title: 'Village has Secret',
  options: {
    1: 'Yes',
    2: 'No',
    3: 'No',
    4: 'No',
    5: 'No',
    6: 'No',
  },
};
const tableVillageSecret: RandomTable = {
  id: 64,
  title: 'Village Secret',
  options: {
    1: 'Animals turned human',
    2: 'Curse',
    3: 'Elder god cult',
    4: 'Eternal youth',
    5: 'Hidden treasure',
    6: 'Hiding outlaws',
    7: 'Hivemind',
    8: 'Inability to leave',
    9: 'Pact with a demon',
    10: 'Sadistic rituals',
    11: 'Secret society',
    12: 'Underground galleries',
  },
};
const tableVillageHasEvent: RandomTable = {
  id: 65,
  title: 'Village has Event',
  options: {
    1: 'Yes',
    2: 'No',
    3: 'No',
    4: 'No',
    5: 'No',
    6: 'No',
  },
};
const tableVillageWhenEventHappens: RandomTable = {
  id: 66,
  title: 'Village has Secret',
  options: {
    1: 'Ended earlier',
    2: 'Is happening now',
    3: 'Is happening now',
    4: 'Is happening now',
    5: 'Will take place in the future',
    6: 'Will take place in the future',
  },
};
const tableVillageEventNature: RandomTable = {
  id: 67,
  title: 'Village Event Nature',
  options: {
    1: 'Adventurers passing by',
    2: 'Announcement by a crier',
    3: 'Ceremony (wedding, etc.)',
    4: 'Controlled by monsters',
    5: 'Disappearances',
    6: 'Famine',
    7: 'Festival/Fair',
    8: 'Fire',
    9: 'Looting',
    10: 'Market day',
    11: 'Plague',
    12: 'Visit of a notable (lord, etc.)',
  },
};
function rollUniqueEntries(
  table: RandomTable,
  count: number,
  rollFn: (faces: number) => number = d
) {
  const results: { roll: number; result: string }[] = [];
  while (results.length < count) {
    const entry = randomOptionEntry(table, rollFn);
    if (!results.some((result) => result.result === entry.result)) {
      results.push(entry);
    }
  }
  return results;
}

function calcVillage(rollFn: (faces: number) => number = d) {
  const name = generateRandomName();
  const size = randomOptionEntry(tableVillageSize, rollFn);
  const sizeFactor = {
    'Small': 1,
    'Medium': 2,
    'Big': 3,
  }[size.result] || 0;
  const population = 50 * sizeFactor;
  const hasOccupation = randomOptionEntry(tableVillageHasOccupation, rollFn).result === 'Yes';
  const occupation =
    hasOccupation
    ? randomOptionEntry(tableVillageOccupation, rollFn)
    : null
  const layout = randomOptionEntry(tableVillageLayout, rollFn);
  const generalLocations = [...villageGeneralLocations];
  const pointsOfInterest = new Array(sizeFactor).fill(0).map(() => randomOptionEntry(tableVillagePointsOfInterest, rollFn));
  const defenses = rollUniqueEntries(tableVillageDefenses, sizeFactor, rollFn);
  const guards = (rollFn(3) + 3) * sizeFactor;
  const villageDisposition = randomOptionEntry(tableVillageDisposition, rollFn);
  const rulerDisposition =
    villageDisposition.result === 'Neutral'
    ? randomOptionEntry(tableVillageRulerDispositionIfVillageDispositionNeutral, rollFn)
    : randomOptionEntry(tableVillageRulerDisposition, rollFn).roll <= 4
      ? villageDisposition // Same as villagers
      : oppositeOptionEntry(villageDisposition.roll, tableVillageDisposition); // Opposite (to as villagers)
  const notableNpcs = new Array(sizeFactor).fill(0).map(() => randomOptionEntry(tableVillageNotableNpcs, rollFn));
  const ruler = randomOptionEntry(tableVillageRuler, rollFn);
  const villageHasSecret = randomOptionEntry(tableVillageHasSecret, rollFn);
  const secret =
    villageHasSecret.result === 'Yes'
    ? randomOptionEntry(tableVillageSecret, rollFn)
    : null;
  const hasEvent = randomOptionEntry(tableVillageHasEvent, rollFn).result === 'Yes';
  const whenEventHappens =
    hasEvent
    ? randomOptionEntry(tableVillageWhenEventHappens, rollFn)
    : null;
  const eventNature =
    hasEvent
    ? randomOptionEntry(tableVillageEventNature, rollFn)
    : null;
  return {
    name,
    size,
    population,
    occupation,
    layout,
    generalLocations,
    pointsOfInterest,
    defenses,
    guards,
    disposition: {
      villageDisposition,
      rulerDisposition,
    },
    people: {
      notableNpcs,
      ruler,
    },
    secret,
    event: {
      hasEvent,
      whenEventHappens,
      eventNature
    },
  };
}

const tableCitySize: RandomTable = {
  id: 68,
  title: 'City Size',
  options: {
    1: 'Medium',
    2: 'Medium',
    3: 'Medium',
    4: 'Small',
    5: 'Small',
    6: 'Big',
  },
};
const tableCityOccupations: RandomTable = {
  id: 69,
  title: 'City Main Occupations',
  options: {
    1: 'Brewing (breweries) or Viticulture (vineyard)',
    2: 'Cattle breeding (farms, meadows)',
    3: 'Farming crops (farms, fields)',
    4: 'Fishing (fishery)',
    5: 'Hunting (tannery)',
    6: 'Logging (sawmills)',
    7: 'Metallurgy (forge, foundry)',
    8: 'Mining (mine)',
    9: 'Pottery (pottery shop)',
    10: 'Trading (caravanserai/port)',
  },
};
const tableCityCharacteristics: RandomTable = {
  id: 70,
  title: 'City Characteristics',
  options: {
    1: 'Nothing',
    2: 'Nothing',
    3: 'Nothing',
    4: 'Nothing',
    5: 'Nothing',
    6: 'Corrupt',
    7: 'Crowded',
    8: 'Destroyed',
    9: 'Dry',
    10: 'Filthy',
    11: 'Holy city',
    12: 'Humid',
    13: 'Narrow',
    14: 'Noisy',
    15: 'Open',
    16: 'Renowned',
    17: 'Silent',
    18: 'Tiered',
    19: 'Unsafe',
    20: 'Windy',
  },
};
const tableCityAppearance: RandomTable = {
  id: 71,
  title: 'City Appearance',
  options: {
    1: 'Cluttered',
    2: 'Cobblestone',
    3: 'Colorful',
    4: 'Covered with art',
    5: 'Dark',
    6: 'Eerie',
    7: 'Flowers',
    8: 'Geometric',
    9: 'Huge windows',
    10: 'Light',
    11: 'Lots of canals',
    12: 'Lots of stairs',
    13: 'Misaligned buildings',
    14: 'Red bricks',
    15: 'Stark',
    16: 'Tall towers',
    17: 'White marble',
    18: 'Wondrous',
    19: 'Wooden',
    20: 'Specific color scheme',
  },
};
const tableCityColorScheme: RandomTable = {
  id: 72,
  title: 'City Color Scheme',
  options: {
    1: 'Grayscale',
    2: 'Black and white',
    3: 'Blue and white',
    4: 'Sand and terracotta',
  },
};
const cityGeneralLocations = [
  'Blacksmiths',
  'Cemeteries',
  'Churches',
  'General stores',
  'Libraries',
  'Markets',
  'Stables',
  'Taverns',
];
const tableCitySpecialLocations: RandomTable = {
  id: 73,
  title: 'City Special Locations',
  options: {
    1: 'Abandoned building',
    2: 'Aqueduct',
    3: 'Archaeological site',
    4: 'Bridge',
    5: 'Burnt/Ruined building',
    6: 'Calvary',
    7: 'Carriage stop',
    8: 'Construction site',
    9: 'Famous street',
    10: 'Fighting pit',
    11: 'Fountain',
    12: 'Gallows',
    13: 'Junkyard',
    14: 'Market hall',
    15: 'Military cemetery',
    16: 'Monument/Memorial',
    17: 'Park',
    18: 'Pilgrimage',
    19: 'Plaza',
    20: 'Slave pit',
  },
};
const tableCityBuildingType: RandomTable = {
  id: 74,
  title: 'City Building Type',
  options: {
    1: 'Housing',
    2: 'Housing',
    3: 'Housing',
    4: 'Business',
    5: 'Business',
    6: 'Business',
    7: 'Business',
    8: 'Business',
    9: 'Business',
    10: 'Business',
    11: 'Official',
    12: 'Official',
    13: 'Official',
    14: 'Religious',
    15: 'Public',
    16: 'Public',
    17: 'Public',
    18: 'Military',
    19: 'Military',
    20: 'Military',
  },
};
const tableCityHousing: RandomTable = {
  id: 75,
  title: 'City Housing',
  options: {
    1: 'Studio',
    2: 'One bedroom apartment',
    3: 'Two bedrooms apartment',
    4: 'Bungalow',
    5: 'Maisonnette',
    6: 'Penthouse',
    7: 'Mansion',
    8: 'Hotel room',
    9: 'Tower',
    10: 'Boarding house',
    11: 'Tent',
    12: 'Houseboat',
    13: 'Under a bridge',
    14: 'Shanty',
    15: 'Squat',
    16: 'Underground bunker',
    17: 'Caravan',
    18: 'Treehouse',
    19: 'Basement',
    20: 'Hut',
  },
};
const tableCityBusiness: RandomTable = {
  id: 76,
  title: 'City Business',
  options: {
    1: 'Alchemist',
    2: 'Alchemist',
    3: 'Animal trainer',
    4: 'Animal trainer',
    5: 'Apothecary',
    6: 'Apothecary',
    7: 'Armorer',
    8: 'Armorer',
    9: 'Artist',
    10: 'Artist',
    11: 'Astronomer',
    12: 'Astronomer',
    13: 'Baker',
    14: 'Baker',
    15: 'Bank',
    16: 'Bank',
    17: 'Blacksmith',
    18: 'Blacksmith',
    19: 'Bookmaker',
    20: 'Bookmaker',
    21: 'Botanist',
    22: 'Botanist',
    23: 'Brewery',
    24: 'Brewery',
    25: 'Brothel',
    26: 'Brothel',
    27: 'Butcher',
    28: 'Butcher',
    29: 'Candlemaker',
    30: 'Candlemaker',
    31: 'Candy shop',
    32: 'Candy shop',
    33: 'Carpenter',
    34: 'Carpenter',
    35: 'Cartographer',
    36: 'Cartographer',
    37: 'Casino',
    38: 'Casino',
    39: 'Cheesemaker',
    40: 'Cheesemaker',
    41: 'Doctor',
    42: 'Doctor',
    43: 'Dollmaker',
    44: 'Dollmaker',
    45: 'Florist',
    46: 'Florist',
    47: 'Fortuneteller',
    48: 'Fortuneteller',
    49: 'Foundry',
    50: 'Foundry',
    51: 'General store',
    52: 'General store',
    53: 'Glassblower',
    54: 'Glassblower',
    55: 'Hairdresser',
    56: 'Hairdresser',
    57: 'Hardware store',
    58: 'Hardware store',
    59: 'Jeweler',
    60: 'Jeweler',
    61: 'Lawyer',
    62: 'Lawyer',
    63: 'Locksmith',
    64: 'Locksmith',
    65: 'Pawnshop',
    66: 'Pawnshop',
    67: 'Perfumer',
    68: 'Perfumer',
    69: 'Pet shop',
    70: 'Pet shop',
    71: 'Potter',
    72: 'Potter',
    73: 'Restaurant',
    74: 'Restaurant',
    75: 'Sage',
    76: 'Sage',
    77: 'Sauna',
    78: 'Sauna',
    79: 'Scribe',
    80: 'Scribe',
    81: 'Siege engines seller',
    82: 'Siege engines seller',
    83: 'Slaughterhouse',
    84: 'Slaughterhouse',
    85: 'Stables',
    86: 'Stables',
    87: 'Tailor',
    88: 'Tailor',
    89: 'Tanner',
    90: 'Tanner',
    91: 'Tapestry maker',
    92: 'Tapestry maker',
    93: 'Tavern',
    94: 'Tavern',
    95: 'Tinker',
    96: 'Tinker',
    97: 'Veterinarian',
    98: 'Veterinarian',
    99: 'Wine shop',
    100: 'Wine shop',
  },
};
const tableCityOfficial: RandomTable = {
  id: 77,
  title: 'City Official Buildings',
  options: {
    1: 'Arcane university',
    2: 'Archives',
    3: 'Asylum',
    4: 'City hall',
    5: 'Conservatory',
    6: 'Dispensary',
    7: 'Embassy',
    8: 'Fire station',
    9: 'Mayor office',
    10: 'Meteorological institute',
    11: 'Mint',
    12: 'Palace',
    13: 'Post office',
    14: 'School',
    15: 'Sewers',
    16: 'Tax office',
    17: 'Tourist office',
    18: 'Tribunal',
    19: 'University',
    20: 'Water tower',
  },
};
const tableCityReligious: RandomTable = {
  id: 78,
  title: 'City Religious Buildings',
  options: {
    1: 'Catacombs',
    2: 'Cathedral',
    3: 'Church',
    4: 'Covent',
    5: 'Mausoleum',
    6: 'Monastery',
    7: 'Necropolis',
    8: 'Orphanage',
    9: 'Sanctuary',
    10: 'Seminar',
    11: 'Shrine',
    12: 'Ziggurat',
  },
};
const tableCityPublic: RandomTable = {
  id: 79,
  title: 'City Public Buildings',
  options: {
    1: 'Aquarium',
    2: 'Arena',
    3: 'Art gallery',
    4: 'Auction hall',
    5: 'Botanical garden',
    6: 'Event center',
    7: 'Gymnasium',
    8: 'Historical building',
    9: 'House for sale',
    10: 'Hospital',
    11: 'Library',
    12: 'Morgue',
    13: 'Museum',
    14: 'Observatory',
    15: 'Opera',
    16: 'Guildhouse',
    17: 'Public baths',
    18: 'Theater',
    19: 'Workshop',
    20: 'Zoo',
  },
};
const tableCityMilitary: RandomTable = {
  id: 80,
  title: 'City Military Buildings',
  options: {
    1: 'Armory',
    2: 'Barracks',
    3: 'Canteen',
    4: 'Citadel',
    5: 'Fort',
    6: 'Guard post',
    7: 'Guard tower',
    8: 'Jail',
    9: 'Menagerie',
    10: 'Military archives',
    11: 'Military hospital',
    12: 'Military school',
    13: 'Military surplus',
    14: 'Prison',
    15: 'Recruitment center',
    16: 'Siege workshop',
    17: 'Spy academy',
    18: 'Training hall',
    19: 'Underground vault',
    20: 'Warehouse',
  },
};
const cityBuildingTables: { [key: string]: RandomTable } = {
  Housing: tableCityHousing,
  Business: tableCityBusiness,
  Official: tableCityOfficial,
  Religious: tableCityReligious,
  Public: tableCityPublic,
  Military: tableCityMilitary,
};
const tableCityEntranceDirection: RandomTable = {
  id: 81,
  title: 'City Entrance Direction',
  options: {
    1: 'North',
    2: 'East',
    3: 'South',
    4: 'West',
  },
};
const tableCityEntranceClosure: RandomTable = {
  id: 82,
  title: 'City Entrance Closure',
  options: {
    1: 'Wooden doors',
    2: 'Wooden doors',
    3: 'Wooden doors',
    4: 'Portcullis',
    5: 'Portcullis',
    6: 'Both',
  },
};
const tableCityDisposition: RandomTable = {
  id: 83,
  title: 'City Disposition',
  dice: '2d6',
  options: {
    2: 'Attack on sight',
    3: 'Hostile',
    4: 'Hostile',
    5: 'Hostile',
    6: 'Neutral',
    7: 'Neutral',
    8: 'Neutral',
    9: 'Welcoming',
    10: 'Welcoming',
    11: 'Welcoming',
    12: 'Enthusiastic',
  },
};
const tableCityRulerDisposition: RandomTable = {
  id: 84,
  title: 'City Ruler\'s Disposition',
  options: {
    1: 'Same as citizens',
    2: 'Same as citizens',
    3: 'Same as citizens',
    4: 'Same as citizens',
    5: 'Opposite',
    6: 'Opposite',
  },
};
const tableCityRulerDispositionIfNeutral: RandomTable = {
  id: 85,
  title: 'City Ruler\'s Disposition if City Disposition is Neutral',
  options: {
    1: 'Hostile',
    2: 'Hostile',
    3: 'Hostile',
    4: 'Welcoming',
    5: 'Welcoming',
    6: 'Welcoming',
  },
};
const tableCityNotableNpcs: RandomTable = {
  id: 86,
  title: 'City Notable NPCs',
  options: {
    1: 'Aggressive guard',
    2: 'Annoying minstrel',
    3: 'Bandit in disguise',
    4: 'Beggar who knows a lot',
    5: 'Clever orphan',
    6: 'Corrupted official',
    7: 'Curious waitress',
    8: 'Distracted scholar',
    9: 'Haughty nobleman',
    10: 'Lonely widow',
    11: 'Nervous tax collector',
    12: 'Penniless merchant',
    13: 'Princess on the run',
    14: 'Retired mercenary',
    15: 'Seasoned adventurer',
    16: 'Shady diplomat',
    17: 'Stubborn wizard',
    18: 'Talented craftsman',
    19: 'Traveler from a distant land',
    20: 'Vampire/Werewolf hunter',
  },
};
const tableCityRuler: RandomTable = {
  id: 87,
  title: 'City Ruler',
  options: {
    1: 'Noble',
    2: 'Noble',
    3: 'Clergy',
    4: 'Council',
    5: 'Mayor',
    6: 'Merchants\' guild',
    7: 'Thieves\' guild',
    8: 'Vampire',
  },
};
const tableCityEventWhen: RandomTable = {
  id: 88,
  title: 'City Event When',
  options: {
    1: 'Ended earlier',
    2: 'Is happening now',
    3: 'Is happening now',
    4: 'Is happening now',
    5: 'Will take place in the future',
    6: 'Will take place in the future',
  },
};
const tableCityEventNature: RandomTable = {
  id: 89,
  title: 'City Event Nature',
  options: {
    1: 'Announcement by a crier',
    2: 'Assassination',
    3: 'Ceremony (wedding, etc.)',
    4: 'Disappearances',
    5: 'Festival/Fair',
    6: 'Fire',
    7: 'Market day',
    8: 'Plague',
    9: 'Siege/Looting',
    10: 'Tournament',
    11: 'Vermin invasion',
    12: 'Visit of a religious person',
  },
};

const citySizeFactors: { [key: string]: number } = {
  Small: 2,
  Medium: 3,
  Big: 4,
};

function calcCityCharacteristics(rollFn: (faces: number) => number = d) {
  const first = randomOptionEntry(tableCityCharacteristics, rollFn);
  let second = randomOptionEntry(tableCityCharacteristics, rollFn);
  while (second.roll === first.roll) {
    second = randomOptionEntry(tableCityCharacteristics, rollFn);
  }
  return [first, second]
    .filter((entry) => entry.result !== 'Nothing')
    .map((entry) => entry.result);
}

function calcCityAppearance(rollFn: (faces: number) => number = d) {
  const appearance = randomOptionEntry(tableCityAppearance, rollFn);
  if (appearance.roll === 20) {
    const colorScheme = randomOptionEntry(tableCityColorScheme, rollFn);
    return {
      roll: appearance.roll,
      result: `${appearance.result}: ${colorScheme.result}`,
    };
  }
  return appearance;
}

function calcCityBuildings(
  sizeFactor: number,
  rollFn: (faces: number) => number = d
) {
  return new Array(sizeFactor * 3).fill(0).map(() => {
    const type = randomOptionEntry(tableCityBuildingType, rollFn);
    const building = randomOptionEntry(cityBuildingTables[type.result], rollFn);
    return {
      type: type.result,
      name: building.result,
    };
  });
}

function calcCityDefense(
  sizeFactor: number,
  rollFn: (faces: number) => number = d
) {
  const walled = rollFn(6) <= 3;
  const entrances = walled
    ? rollUniqueEntries(tableCityEntranceDirection, sizeFactor, rollFn).map((entry) => ({
        direction: entry.result,
        towers: 2,
        closure: randomOptionEntry(tableCityEntranceClosure, rollFn).result,
      }))
    : [];
  const guards = (rollFn(3) + 3) * 5 * sizeFactor;
  const siegeSuppliesMonths = walled ? rollFn(6) + rollFn(6) : null;
  return {
    walled,
    entrances,
    guards,
    siegeSuppliesMonths,
  };
}

function calcCityDisposition(rollFn: (faces: number) => number = d) {
  const cityDisposition = randomOptionEntry(tableCityDisposition, rollFn);
  const rulerDisposition =
    cityDisposition.result === 'Neutral'
      ? randomOptionEntry(tableCityRulerDispositionIfNeutral, rollFn)
      : randomOptionEntry(tableCityRulerDisposition, rollFn).roll <= 4
        ? cityDisposition // Same as citizens
        : oppositeOptionEntry(cityDisposition.roll, tableCityDisposition); // Opposite (to as citizens)
  return {
    cityDisposition,
    rulerDisposition,
  };
}

function calcCityEvent(rollFn: (faces: number) => number = d) {
  const hasEvent = rollFn(6) === 1;
  return {
    hasEvent,
    whenEventHappens: hasEvent
      ? randomOptionEntry(tableCityEventWhen, rollFn)
      : null,
    eventNature: hasEvent
      ? randomOptionEntry(tableCityEventNature, rollFn)
      : null,
  };
}

function calcCity(rollFn: (faces: number) => number = d) {
  const name = generateRandomName();
  const size = randomOptionEntry(tableCitySize, rollFn);
  const sizeFactor = citySizeFactors[size.result] || 0;
  const population = sizeFactor * 500;
  const occupations = new Array(sizeFactor).fill(0).map(() =>
    randomOptionEntry(tableCityOccupations, rollFn)
  );
  const characteristics = calcCityCharacteristics(rollFn);
  const appearance = calcCityAppearance(rollFn);
  const generalLocations = cityGeneralLocations.map(
    (location) => `${sizeFactor} ${location}`
  );
  const specialLocations = new Array(sizeFactor).fill(0).map(() =>
    randomOptionEntry(tableCitySpecialLocations, rollFn)
  );
  const buildingsOfInterest = calcCityBuildings(sizeFactor, rollFn);
  const defense = calcCityDefense(sizeFactor, rollFn);
  const notableNpcs = new Array(sizeFactor).fill(0).map(() =>
    randomOptionEntry(tableCityNotableNpcs, rollFn)
  );
  const ruler = randomOptionEntry(tableCityRuler, rollFn);
  const disposition = calcCityDisposition(rollFn);
  const event = calcCityEvent(rollFn);
  return {
    name,
    size,
    population,
    occupations,
    characteristics,
    appearance,
    generalLocations,
    specialLocations,
    buildingsOfInterest,
    defense,
    people: {
      notableNpcs,
      ruler,
    },
    disposition,
    event,
  };
}

const tableCastleNameFirst: RandomTable = {
  id: 90,
  title: 'Castle Name (First Part)',
  options: {
    1: 'Apple',
    2: 'Battle',
    3: 'Black',
    4: 'Bleak',
    5: 'Blood(y)',
    6: 'Bright',
    7: 'Broken',
    8: 'Cloud',
    9: 'Dark',
    10: 'Dawn',
    11: 'Dragon',
    12: 'Dusk',
    13: 'Fire',
    14: 'Gold(en)',
    15: 'Hammer',
    16: 'Hawk',
    17: 'Horse',
    18: 'Ice',
    19: 'Light',
    20: 'Lion',
    21: 'Moon',
    22: 'Oak',
    23: 'Raven',
    24: 'Red',
    25: 'River',
    26: 'Rose',
    27: 'Silver',
    28: 'Star',
    29: 'Stone',
    30: 'Wind(y)',
  },
};
const tableCastleNameSecond: RandomTable = {
  id: 91,
  title: 'Castle Name (Second Part)',
  options: {
    1: 'Bane',
    2: 'Bridge',
    3: 'Fall/Fell',
    4: 'Fang',
    5: 'Foot',
    6: 'Heart',
    7: 'Herd',
    8: 'Hold',
    9: 'Hook',
    10: 'Keep',
    11: 'Maw',
    12: 'Mist',
    13: 'Moor',
    14: 'Peak',
    15: 'Rock',
    16: 'Shield',
    17: 'Skull',
    18: 'Song',
    19: 'Soul',
    20: 'Storm',
    21: 'Thorn',
    22: 'Vale',
    23: 'Way',
    24: 'Wood',
  },
};
const tableCastleCondition: RandomTable = {
  id: 92,
  title: 'Castle General Condition',
  options: {
    1: 'Perfect',
    2: 'Worn',
    3: 'Worn',
    4: 'Aged',
    5: 'Aged',
    6: 'Crumbling',
  },
};
const tableCastleKeepShape: RandomTable = {
  id: 93,
  title: 'Castle Keep Shape',
  options: {
    1: 'Square/Rectangle',
    2: 'Square/Rectangle',
    3: 'Square/Rectangle',
    4: 'Round',
    5: 'Round',
    6: 'Shell (= hollow cylinder)',
  },
};
const tableCastleDefensiveFeature: RandomTable = {
  id: 94,
  title: 'Castle Defensive Feature',
  options: {
    1: 'None',
    2: 'None',
    3: 'None',
    4: 'None',
    5: 'None',
    6: 'None',
    7: 'Ballista',
    8: 'Boiling oil',
    9: 'Catapult',
    10: 'Hoarding',
    11: 'Iron spikes',
    12: 'Piles of rocks',
  },
};
const tableCastleNonDefensiveFeature: RandomTable = {
  id: 95,
  title: 'Castle Non-Defensive Feature',
  options: {
    1: 'None',
    2: 'None',
    3: 'None',
    4: 'None',
    5: 'None',
    6: 'None',
    7: 'Banners/Flags',
    8: 'Gargoyles',
    9: 'Heads/Bodies',
    10: 'Overgrown',
    11: 'Religious symbols',
    12: 'Secret passage',
  },
};
const tableCastleDefensiveStructures: RandomTable = {
  id: 96,
  title: 'Castle Defensive Structures',
  options: {
    1: 'Stone walls and towers',
    2: 'Stone walls and towers',
    3: 'Stone walls and towers',
    4: 'Moat (= trench)',
    5: 'Motte (= mound)',
    6: 'Wooden palisade',
  },
};
const tableCastleWallShape: RandomTable = {
  id: 97,
  title: 'Castle Wall Shape',
  options: {
    1: 'Square/Rectangle',
    2: 'Trapezium',
    3: 'Pentagon',
    4: 'Hexagon',
    5: 'Octagon',
    6: 'Star',
    7: 'Cross',
    8: 'Circle',
  },
};
const castleWallTowers: { [key: number]: number } = {
  1: 4,
  2: 4,
  3: 5,
  4: 6,
  5: 8,
  6: 10,
  7: 12,
};
const tableCastleGatehouse: RandomTable = {
  id: 98,
  title: 'Castle Gatehouse',
  options: {
    1: 'Portcullis and wooden door',
    2: 'Portcullis and wooden door',
    3: 'Portcullis and wooden door',
    4: 'Drawbridge',
    5: 'Drawbridge',
    6: 'Both',
  },
};
/**
 * The 2023 edition says "Roll 1d6" but lists eight results; 1d8 is used so
 * every entry is reachable.
 */
const tableCastleMoatEncounter: RandomTable = {
  id: 99,
  title: 'Castle Moat Encounters',
  dice: '1d8',
  options: {
    1: 'Nothing',
    2: 'Nothing',
    3: 'Nothing',
    4: 'Nothing',
    5: 'Crocodiles',
    6: 'Electric eels',
    7: 'Leeches',
    8: 'Piranha',
  },
};
const tableCastleDisposition: RandomTable = {
  id: 100,
  title: 'Castle Disposition',
  dice: '2d6',
  options: {
    2: 'Attack on sight',
    3: 'Hostile',
    4: 'Hostile',
    5: 'Hostile',
    6: 'Neutral',
    7: 'Neutral',
    8: 'Neutral',
    9: 'Welcoming',
    10: 'Welcoming',
    11: 'Welcoming',
    12: 'Enthusiastic',
  },
};
const tableCastleEventWhen: RandomTable = {
  id: 101,
  title: 'Castle Event When',
  options: {
    1: 'Ended earlier',
    2: 'Is happening now',
    3: 'Is happening now',
    4: 'Is happening now',
    5: 'Will take place in the future',
    6: 'Will take place in the future',
  },
};
const tableCastleEventNature: RandomTable = {
  id: 102,
  title: 'Castle Event Nature',
  options: {
    1: 'Assassination',
    2: 'Big HD monster attack',
    3: 'Ceremony (wedding, etc.)',
    4: 'Festival/Fair',
    5: 'Fire',
    6: 'Plague',
    7: 'Resources/Gold dwindling',
    8: 'Rival lord scouting',
    9: 'Small HD monsters wanting to establish a lair nearby',
    10: 'Siege/Looting',
    11: 'Tournament',
    12: 'Visit of a notable person',
  },
};

function calcCastleName(rollFn: (faces: number) => number = d) {
  const first = randomOptionEntry(tableCastleNameFirst, rollFn);
  const second = randomOptionEntry(tableCastleNameSecond, rollFn);
  return `Castle ${first.result} ${second.result}`;
}

function calcCastleTreasure(rollFn: (faces: number) => number = d) {
  const goldFromFirst = rollFn(2) === 1 ? rollFn(4) * 10000 : 0;
  const goldFromSecond = rollFn(2) === 1 ? rollFn(6) * 5000 : 0;
  const gems = rollFn(4) === 1 ? rollFn(6) + rollFn(6) + rollFn(6) : 0;
  const jewelry = rollFn(4) === 1 ? rollFn(10) : 0;
  const hasMagicItems = rollFn(100) <= 15;
  return {
    goldPieces: goldFromFirst + goldFromSecond,
    gems,
    jewelry,
    magicItems: hasMagicItems ? 4 : 0,
    scrolls: hasMagicItems ? rollFn(6) : 0,
  };
}

function calcCastleKeep(rollFn: (faces: number) => number = d) {
  const shape = randomOptionEntry(tableCastleKeepShape, rollFn);
  const levels = rollFn(3) + 1;
  const defensiveFeature = randomOptionEntry(tableCastleDefensiveFeature, rollFn);
  const nonDefensiveFeature = randomOptionEntry(tableCastleNonDefensiveFeature, rollFn);
  const jails = {
    commoners: rollFn(6) + rollFn(6),
    nobles: rollFn(3),
  };
  const suppliesMonths = rollFn(6) + rollFn(6);
  const treasure = calcCastleTreasure(rollFn);
  return {
    shape,
    levels,
    defensiveFeature,
    nonDefensiveFeature,
    jails,
    suppliesMonths,
    treasure,
  };
}

function calcCastleTowersAndWalls(rollFn: (faces: number) => number = d) {
  const shape = randomOptionEntry(tableCastleWallShape, rollFn);
  const towers = shape.roll === 8 ? rollFn(3) + 3 : castleWallTowers[shape.roll];
  const defensiveFeature = randomOptionEntry(tableCastleDefensiveFeature, rollFn);
  const nonDefensiveFeature = randomOptionEntry(tableCastleNonDefensiveFeature, rollFn);
  return {
    shape,
    towers,
    defensiveFeature,
    nonDefensiveFeature,
  };
}

function calcCastleDefense(rollFn: (faces: number) => number = d) {
  const structureCount = rollFn(4);
  const structures = rollUniqueEntries(tableCastleDefensiveStructures, structureCount, rollFn);
  const hasStoneWalls = structures.some(
    (structure) => structure.result === 'Stone walls and towers'
  );
  const hasMoat = structures.some((structure) => structure.result === 'Moat (= trench)');
  return {
    structures,
    towersAndWalls: hasStoneWalls ? calcCastleTowersAndWalls(rollFn) : null,
    gatehouse: hasStoneWalls ? randomOptionEntry(tableCastleGatehouse, rollFn) : null,
    moatEncounter: hasMoat ? randomOptionEntry(tableCastleMoatEncounter, rollFn) : null,
  };
}

function calcCastleGarrison(rollFn: (faces: number) => number = d) {
  const total = (rollFn(6) + rollFn(6) + rollFn(6)) * 10;
  const composition = [
    { type: 'Cavaliers: heavy horse, plate & shield, sword', percentage: 10 },
    { type: 'Cavaliers: medium horse, plate & shield, spear', percentage: 10 },
    { type: 'Cavaliers: medium horse, chainmail, short bow', percentage: 10 },
    { type: 'Footmen: chainmail & shield, sword', percentage: 40 },
    { type: 'Footmen: chainmail, polearm', percentage: 10 },
    { type: 'Footmen: chainmail, crossbow', percentage: 10 },
    { type: 'Footmen: chainmail, longbow', percentage: 10 },
  ].map((entry) => ({
    type: entry.type,
    count: (total * entry.percentage) / 100,
  }));
  const lordLevel = 9 + Math.floor(total / 60);
  const lieutenantLevel = lordLevel - 2;
  return {
    total,
    composition,
    lord: { level: lordLevel },
    lieutenant: { level: lieutenantLevel },
    bodyguards: { count: 6, level: lieutenantLevel - 3 },
  };
}

function calcCastleDisposition(rollFn: (faces: number) => number = d) {
  return randomOptionEntry(tableCastleDisposition, rollFn);
}

function calcCastleEvent(rollFn: (faces: number) => number = d) {
  const hasEvent = rollFn(6) === 1;
  return {
    hasEvent,
    whenEventHappens: hasEvent
      ? randomOptionEntry(tableCastleEventWhen, rollFn)
      : null,
    eventNature: hasEvent
      ? randomOptionEntry(tableCastleEventNature, rollFn)
      : null,
  };
}

function calcCastle(rollFn: (faces: number) => number = d) {
  const name = calcCastleName(rollFn);
  const condition = randomOptionEntry(tableCastleCondition, rollFn);
  const keep = calcCastleKeep(rollFn);
  const defense = calcCastleDefense(rollFn);
  const garrison = calcCastleGarrison(rollFn);
  const disposition = calcCastleDisposition(rollFn);
  const event = calcCastleEvent(rollFn);
  return {
    name,
    condition,
    keep,
    defense,
    garrison,
    disposition,
    event,
  };
}

const tableTowerWizardLevel: RandomTable = {
  id: 103,
  title: 'Wizard Level',
  dice: '2d6',
  options: {
    2: '7',
    3: '8',
    4: '8',
    5: '8',
    6: '9',
    7: '9',
    8: '9',
    9: '10',
    10: '10',
    11: '10',
    12: '11',
  },
};
const tableTowerAbovegroundLevels: RandomTable = {
  id: 104,
  title: 'Tower Aboveground Levels',
  options: {
    1: 'One',
    2: 'Two',
    3: 'Two',
    4: 'Three',
    5: 'Three',
    6: 'Three',
    7: 'Four',
    8: 'Four',
    9: 'Four',
    10: 'Five',
    11: 'Five',
    12: 'Six',
  },
};
const tableTowerUndergroundLevels: RandomTable = {
  id: 105,
  title: 'Tower Underground Levels',
  options: {
    1: 'Zero',
    2: 'Zero',
    3: 'Zero',
    4: 'Zero',
    5: 'Zero',
    6: 'Zero',
    7: 'One',
    8: 'One',
    9: 'Two',
    10: 'Two',
    11: 'Three',
    12: 'Four',
  },
};
const towerAbovegroundLevelCounts: { [key: string]: number } = {
  One: 1,
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
  Six: 6,
};
const towerUndergroundLevelCounts: { [key: string]: number } = {
  Zero: 0,
  One: 1,
  Two: 2,
  Three: 3,
  Four: 4,
};
const tableTowerConnection: RandomTable = {
  id: 106,
  title: 'Tower Levels Connection',
  options: {
    1: 'Staircase',
    2: 'Staircase',
    3: 'Staircase',
    4: 'Spiral staircase',
    5: 'Spiral staircase',
    6: 'Spiral staircase',
    7: 'Ladder',
    8: 'Ladder',
    9: 'Elevator',
    10: 'Elevator',
    11: 'Magic elevator',
    12: 'Teleportation portals',
  },
};
const tableTowerMaterial: RandomTable = {
  id: 107,
  title: 'Tower Material Used',
  options: {
    1: 'Cobblestone',
    2: 'Cobblestone',
    3: 'Cobblestone',
    4: 'Cobblestone',
    5: 'Cobblestone',
    6: 'Wood',
    7: 'Wood',
    8: 'Wood',
    9: 'Wood',
    10: 'Wood',
    11: 'Bricks',
    12: 'Bricks',
    13: 'Bricks',
    14: 'Sandstone',
    15: 'Sandstone',
    16: 'Sandstone',
    17: 'Limestone',
    18: 'Limestone',
    19: 'Marble',
    20: 'Metal',
  },
};
const tableTowerShape: RandomTable = {
  id: 108,
  title: 'Tower Shape',
  options: {
    1: 'Square',
    2: 'Square',
    3: 'Square',
    4: 'Square',
    5: 'Square',
    6: 'Round',
    7: 'Round',
    8: 'Round',
    9: 'Round',
    10: 'Round',
    11: 'Conical',
    12: 'Conical',
    13: 'Conical',
    14: 'Tilted',
    15: 'Tilted',
    16: 'Tilted',
    17: 'Asymmetrical',
    18: 'S-shaped',
    19: 'Stacked',
    20: 'Twisted',
  },
};
const tableTowerDetails: RandomTable = {
  id: 109,
  title: 'Tower Details',
  options: {
    1: 'Nothing',
    2: 'Nothing',
    3: 'Nothing',
    4: 'Nothing',
    5: 'Nothing',
    6: 'Nothing',
    7: 'Nothing',
    8: 'Nothing',
    9: 'Nothing',
    10: 'Nothing',
    11: 'Balcony',
    12: 'Banners',
    13: 'Battlements',
    14: 'Climbing plants',
    15: 'Flags',
    16: 'Moldings',
    17: 'Porch',
    18: 'Stained glass',
    19: 'Statues/Gargoyles',
    20: 'Turrets',
  },
};
const tableTowerInsideAppearance: RandomTable = {
  id: 110,
  title: 'Tower Inside Appearance',
  options: {
    1: 'Colorful',
    2: 'Cozy',
    3: 'Dark',
    4: 'Dusty',
    5: 'Extravagant',
    6: 'Luxurious',
    7: 'Moldy',
    8: 'Old fashioned',
    9: 'Stark',
    10: 'Well decorated',
  },
};
const tableTowerSpecialEquipment: RandomTable = {
  id: 111,
  title: 'Tower Special Equipment',
  options: {
    1: 'Nothing',
    2: 'Nothing',
    3: 'Nothing',
    4: 'Nothing',
    5: 'Nothing',
    6: 'Nothing',
    7: 'Nothing',
    8: 'Nothing',
    9: 'Nothing',
    10: 'Nothing',
    11: 'Acoustic tube',
    12: 'Alarm system',
    13: 'Dumbwaiter',
    14: 'Emergency ladder/stairs',
    15: 'Garbage chute',
    16: 'Oversized pet doors',
    17: 'Pneumatic tubes',
    18: 'Secret passage',
    19: 'Slide',
    20: 'Ventilation system',
  },
};
const tableTowerGroundLevel: RandomTable = {
  id: 112,
  title: 'Tower Ground Level',
  options: {
    1: 'Empty and dusty',
    2: 'Fortified room',
    3: 'Hallway',
    4: 'Reception desk',
    5: 'Ruined room',
    6: 'Shop/Tavern',
    7: 'Trapped room',
    8: 'Unloading room',
  },
};
const tableTowerAbovegroundUsage: RandomTable = {
  id: 113,
  title: 'Tower Aboveground Levels Usage',
  options: {
    1: 'Abandoned/Cursed level',
    2: 'Archives',
    3: 'Armory',
    4: 'Bedroom(s)',
    5: 'Kitchen and dining room',
    6: 'Laboratory',
    7: 'Library',
    8: 'Meeting room',
    9: 'Museum',
    10: 'Music room/Art room',
    11: 'Office/Study',
    12: 'Storage room',
  },
};
const tableTowerTopLevel: RandomTable = {
  id: 114,
  title: 'Tower Top Level',
  options: {
    1: 'Aviary',
    2: 'Beacon',
    3: 'Duel platform',
    4: 'Foghorn',
    5: 'Golden apple tree',
    6: 'Greenhouse',
    7: 'High security prison',
    8: 'Landing platform',
    9: 'Lightning rod',
    10: 'Lookout post',
    11: 'Magic searchlight',
    12: 'Monster nest',
    13: 'Observatory',
    14: 'Panic room',
    15: 'Ruined/Overgrown',
    16: 'Siege engine',
    17: 'Throne room',
    18: 'Treasure room',
    19: 'Weather station',
    20: 'Windmill',
  },
};
const tableTowerUndergroundUsage: RandomTable = {
  id: 115,
  title: 'Tower Underground Levels Usage',
  options: {
    1: 'Abandoned/Cursed level',
    2: 'Alchemy lab',
    3: 'Cellar',
    4: 'Chapel',
    5: 'Forge',
    6: 'Menagerie',
    7: 'Mushroom cave',
    8: 'Prison',
    9: 'Rituals room',
    10: 'Storage',
    11: 'Torture room',
    12: 'Wine cellar',
  },
};
const tableTowerBottomLevel: RandomTable = {
  id: 116,
  title: 'Tower Bottom Level',
  options: {
    1: 'Abyss',
    2: 'Ancient ruins',
    3: 'Arena',
    4: 'Boudoir',
    5: 'Creature mouth',
    6: 'Excavation site',
    7: 'Flesh pit',
    8: 'Flooded pit',
    9: 'Gambling den',
    10: 'Magic portal',
    11: 'Magic well',
    12: 'Mine',
    13: 'Oubliette',
    14: 'Tunnel to the center of the planet',
    15: 'Secret society headquarters',
    16: 'Tomb',
    17: 'Tunnel to a lair',
    18: 'Tunnel to the surface',
    19: 'Vault',
    20: 'Well',
  },
};

/**
 * Wizard level table from the 2023 edition (p. 147). Towers require a wizard
 * of at least level 9, so lower results are raised to 9.
 */
function calcTowerWizard(rollFn: (faces: number) => number = d) {
  const rolled = randomOptionEntry(tableTowerWizardLevel, rollFn);
  const hasApprentice = rollFn(4) === 1;
  return {
    level: Math.max(9, Number(rolled.result)),
    apprentice: hasApprentice ? { level: rollFn(6) } : null,
  };
}

function calcTower(rollFn: (faces: number) => number = d) {
  const wizard = calcTowerWizard(rollFn);
  const abovegroundLevels =
    towerAbovegroundLevelCounts[
      randomOptionEntry(tableTowerAbovegroundLevels, rollFn).result
    ];
  const undergroundLevels =
    towerUndergroundLevelCounts[
      randomOptionEntry(tableTowerUndergroundLevels, rollFn).result
    ];
  const connection = randomOptionEntry(tableTowerConnection, rollFn);
  const material = randomOptionEntry(tableTowerMaterial, rollFn);
  const shape = randomOptionEntry(tableTowerShape, rollFn);
  const detailCount = rollFn(3);
  const details = new Array(detailCount)
    .fill(0)
    .map(() => randomOptionEntry(tableTowerDetails, rollFn))
    .filter((detail) => detail.result !== 'Nothing');
  const insideAppearance = randomOptionEntry(tableTowerInsideAppearance, rollFn);
  const specialEquipment = randomOptionEntry(tableTowerSpecialEquipment, rollFn);
  const ground = randomOptionEntry(tableTowerGroundLevel, rollFn);
  const aboveground = new Array(abovegroundLevels)
    .fill(0)
    .map(() => randomOptionEntry(tableTowerAbovegroundUsage, rollFn));
  const top = randomOptionEntry(tableTowerTopLevel, rollFn);
  const underground = new Array(undergroundLevels)
    .fill(0)
    .map(() => randomOptionEntry(tableTowerUndergroundUsage, rollFn));
  const bottom =
    undergroundLevels > 0
      ? randomOptionEntry(tableTowerBottomLevel, rollFn)
      : null;
  const totalLevels =
    1 +
    abovegroundLevels +
    1 +
    undergroundLevels +
    (undergroundLevels > 0 ? 1 : 0);
  return {
    wizard,
    levels: {
      aboveground: abovegroundLevels,
      underground: undergroundLevels,
      total: totalLevels,
    },
    connection,
    outside: {
      material,
      shape,
      details,
    },
    insideAppearance,
    specialEquipment,
    levelUsage: {
      ground,
      aboveground,
      top,
      underground,
      bottom,
    },
  };
}

const tableAbbeyName: RandomTable = {
  id: 117,
  title: 'Abbey Name',
  options: {
    1: 'Blessed-Land',
    2: 'Clear-Water',
    3: 'Fruitful-Garden',
    4: 'Good-...',
    5: 'Peaceful-Soul',
    6: 'Sacred-Heart',
    7: 'Our-Lady-of-...',
    8: 'Saint-...',
    9: 'Saint-...',
    10: 'Saint-...',
  },
};
const tableAbbeyNameGood: RandomTable = {
  id: 118,
  title: 'Abbey Name (Good-...)',
  options: {
    1: 'Help',
    2: 'Hope',
    3: 'Relief',
  },
};
const tableAbbeyNameOurLady: RandomTable = {
  id: 119,
  title: 'Abbey Name (Our-Lady-of-...)',
  options: {
    1: 'Chastity',
    2: 'Mercy',
    3: 'the Poor',
  },
};
const tableAbbeySaints: RandomTable = {
  id: 120,
  title: 'Abbey Saints',
  options: {
    1: 'Adélie',
    2: 'Agath',
    3: 'Alexia',
    4: 'Aubreda',
    5: 'Bardolphus',
    6: 'Barthélemy',
    7: 'Beatrix',
    8: 'Bérengérius',
    9: 'Bernard(us)',
    10: 'Cecilia',
    11: 'Cédany',
    12: 'Émelote',
    13: 'Gaufridus',
    14: 'Geffrey',
    15: 'Géroldin',
    16: 'Guillotin',
    17: 'Jaclyn',
    18: 'Jacomus',
    19: 'Madeleine',
    20: 'Marion',
    21: 'Mariorie',
    22: 'Martin',
    23: 'Mary',
    24: 'Melchior',
    25: 'Paul',
    26: 'Pétasse',
    27: 'Peter',
    28: 'Remy',
    29: 'Thomasse',
    30: 'Victor',
  },
};
const tableAbbeySize: RandomTable = {
  id: 121,
  title: 'Abbey Size',
  options: {
    1: 'Small',
    2: 'Small',
    3: 'Small',
    4: 'Small',
    5: 'Small',
    6: 'Major',
  },
};
const tableAbbeyGarden: RandomTable = {
  id: 122,
  title: 'Abbey Garden',
  options: {
    1: 'Flower garden',
    2: 'Fountain',
    3: 'Kitchen garden',
    4: 'Physic garden (medicine)',
  },
};
const tableAbbeyInfirmary: RandomTable = {
  id: 123,
  title: 'Abbey Infirmary',
  options: {
    1: 'Bloodletting & purging room',
    2: 'Drugstore',
    3: "Physician's residence",
    4: 'Room for critical patients',
  },
};
const tableAbbeyReligiousBuildings: RandomTable = {
  id: 124,
  title: 'Abbey Religious Buildings',
  options: {
    1: 'Chapter house (for meetings)',
    2: 'Parlour',
    3: 'School',
    4: 'Scriptorium and library',
  },
};
const tableAbbeyOtherLocations: RandomTable = {
  id: 125,
  title: 'Abbey Other Locations',
  options: {
    1: "Abbot's gateway",
    2: 'Barns and stables',
    3: 'Guest rooms',
    4: 'Vestarium (clothing storage)',
    5: 'Washhouse',
    6: 'Watchtower',
  },
};
const tableAbbeyFarming: RandomTable = {
  id: 126,
  title: 'Abbey Farming Activities',
  options: {
    1: 'Barley (beer)',
    2: 'Chickens (meat)',
    3: 'Cotton',
    4: 'Cows (meat, milk and cheese)',
    5: 'Goats (meat, milk and cheese)',
    6: 'Grapes (wine)',
    7: 'Hops (beer)',
    8: 'Orchard (fruits and preserves)',
    9: 'Pigs (meat)',
    10: 'Sheeps (meat and wool)',
    11: 'Vegetables',
    12: 'Wheat (flour and bread)',
  },
};
const tableAbbeyWorkshop: RandomTable = {
  id: 127,
  title: 'Abbey Workshop Activities',
  options: {
    1: 'Candle makers',
    2: 'Cutlers',
    3: 'Potters',
    4: 'Shoemakers',
    5: 'Smiths',
    6: 'Tanners',
  },
};
const tableAbbeyOtherActivities: RandomTable = {
  id: 128,
  title: 'Abbey Other Activities',
  options: {
    1: 'Bee keeping',
    2: 'Bookshop',
    3: 'Catering',
    4: 'Copy & translation',
    5: 'Exorcism',
    6: 'Guided tour',
  },
};
const tableAbbeyFame: RandomTable = {
  id: 129,
  title: 'Abbey Fame',
  options: {
    1: 'Age',
    2: 'Architecture',
    3: 'Cattle baptism',
    4: 'Curative (hot) springs',
    5: 'Domain and landscapes',
    6: 'Grave of well known bishop',
    7: 'Key religious celebration',
    8: 'Meals served to travelers',
    9: 'Pilgrimage',
    10: 'Power',
    11: 'Quality of products',
    12: 'Religious artifact',
    13: 'Religious artifact',
    14: 'Religious artifact',
    15: 'Religious artifact',
    16: 'Religious artifact',
    17: 'Religious artifact',
    18: 'Religious artifact',
    19: 'Religious artifact',
    20: 'Religious artifact',
  },
};
const tableAbbeyArtifactNature: RandomTable = {
  id: 130,
  title: 'Abbey Religious Artifact',
  options: {
    1: 'Ancient parchment',
    2: 'Art piece',
    3: 'Crown',
    4: 'Holy sword',
    5: 'Precious book',
    6: 'Relic',
  },
};
const tableAbbeyRelicType: RandomTable = {
  id: 131,
  title: 'Abbey Relic Type',
  options: {
    1: 'Arm',
    2: 'Blood',
    3: 'Bones (vertebra, phalanx)',
    4: 'Eye',
    5: 'Flesh',
    6: 'Head',
    7: 'Heart',
    8: 'Item that killed the saint',
    9: 'Leg',
    10: 'Piece of clothing',
    11: 'Prayer book',
    12: 'Religious symbol',
    13: 'Ring',
    14: 'Sandals',
    15: 'Scalp',
    16: 'Shroud',
    17: 'Skin',
    18: 'Tongue',
    19: 'Tooth',
    20: 'Walking stick',
  },
};
const tableAbbeyRelicSpellLevel: RandomTable = {
  id: 132,
  title: 'Abbey Relic Spell Level',
  options: {
    1: 'Level 1',
    2: 'Level 1',
    3: 'Level 1',
    4: 'Level 1',
    5: 'Level 1',
    6: 'Level 1',
    7: 'Level 1',
    8: 'Level 1',
    9: 'Level 2',
    10: 'Level 2',
    11: 'Level 2',
    12: 'Level 2',
    13: 'Level 2',
    14: 'Level 2',
    15: 'Level 3',
    16: 'Level 3',
    17: 'Level 3',
    18: 'Level 4',
    19: 'Level 4',
    20: 'Level 5',
  },
};
const tableAbbeyEventWhen: RandomTable = {
  id: 133,
  title: 'Abbey Event When',
  options: {
    1: 'Ended earlier',
    2: 'Is happening now',
    3: 'Is happening now',
    4: 'Is happening now',
    5: 'Will take place in the future',
    6: 'Will take place in the future',
  },
};
const tableAbbeyEventNature: RandomTable = {
  id: 134,
  title: 'Abbey Event Nature',
  options: {
    1: 'Broken device',
    2: 'Cowls shrunken/dyed in red',
    3: 'Demonic corruption',
    4: 'Disappearance of the abbot',
    5: 'Drought/Flood',
    6: 'Festival/Fair',
    7: 'Fire',
    8: 'Looting',
    9: 'Moles/Rats infestation',
    10: 'Plague',
    11: 'Scandal',
    12: 'Visit of a notable person',
  },
};
const tableAbbeyHistory: RandomTable = {
  id: 135,
  title: 'Abbey History',
  options: {
    1: 'Abandoned then used again',
    2: 'Changed confession',
    3: 'Claimed its autonomy',
    4: 'Destroyed then rebuilt',
    5: 'Founded 2d10 x10 years ago',
    6: 'Has seen better days',
    7: 'Only one original building remains',
    8: 'Sponsored by a rich patron',
    9: 'Started as a knight hermitage',
    10: 'Used to be a boarding school',
    11: 'Was relocated',
    12: 'Was under a spell',
  },
};

const abbeyCoreLocations = [
  "Abbot's room",
  'Cellars',
  'Cemetery',
  'Church',
  'Cloisters and garden',
  'Infirmary',
  'Kitchen and refectory',
  'Monks cells',
  'Necessarium (latrines)',
  'Servants, laborers and tradesmen quarters',
  'Storehouses',
];

const abbeyStructure = {
  wall: 'Stone wall with a large gate',
  outsideWalls: 'Fields and farming buildings (barns, mills, etc.)',
  insideWallsAcres: '3-4',
};

function calcAbbeyName(rollFn: (faces: number) => number = d) {
  const name = randomOptionEntry(tableAbbeyName, rollFn);
  if (name.roll === 4) {
    return `Good-${randomOptionEntry(tableAbbeyNameGood, rollFn).result}`;
  }
  if (name.roll === 7) {
    return `Our-Lady-of-${randomOptionEntry(tableAbbeyNameOurLady, rollFn).result}`;
  }
  if (name.roll >= 8) {
    return `Saint-${randomOptionEntry(tableAbbeySaints, rollFn).result}`;
  }
  return name.result;
}

function calcAbbeyAdditionalLocations(rollFn: (faces: number) => number = d) {
  return {
    garden: randomOptionEntry(tableAbbeyGarden, rollFn),
    infirmary: randomOptionEntry(tableAbbeyInfirmary, rollFn),
    religiousBuildings: randomOptionEntry(tableAbbeyReligiousBuildings, rollFn),
    other: randomOptionEntry(tableAbbeyOtherLocations, rollFn),
  };
}

function calcAbbeyActivities(rollFn: (faces: number) => number = d) {
  return {
    farming: rollUniqueEntries(tableAbbeyFarming, 2, rollFn),
    workshop: randomOptionEntry(tableAbbeyWorkshop, rollFn),
    other: randomOptionEntry(tableAbbeyOtherActivities, rollFn),
  };
}

function calcAbbeyFame(size: string, rollFn: (faces: number) => number = d) {
  if (size !== 'Major') {
    return null;
  }
  const fame = randomOptionEntry(tableAbbeyFame, rollFn);
  if (fame.roll < 12) {
    return { fame, artifact: null };
  }
  const artifact = randomOptionEntry(tableAbbeyArtifactNature, rollFn);
  if (artifact.roll !== 6) {
    return { fame, artifact: { nature: artifact, relic: null } };
  }
  return {
    fame,
    artifact: {
      nature: artifact,
      relic: {
        type: randomOptionEntry(tableAbbeyRelicType, rollFn),
        saint: randomOptionEntry(tableAbbeySaints, rollFn),
        spellLevel: randomOptionEntry(tableAbbeyRelicSpellLevel, rollFn),
      },
    },
  };
}

function calcAbbeyEvent(rollFn: (faces: number) => number = d) {
  const hasEvent = rollFn(6) === 1;
  return {
    hasEvent,
    when: hasEvent ? randomOptionEntry(tableAbbeyEventWhen, rollFn) : null,
    nature: hasEvent ? randomOptionEntry(tableAbbeyEventNature, rollFn) : null,
  };
}

function calcAbbeyHistory(rollFn: (faces: number) => number = d) {
  const history = randomOptionEntry(tableAbbeyHistory, rollFn);
  return {
    history,
    foundedYearsAgo:
      history.roll === 5 ? (rollFn(10) + rollFn(10)) * 10 : null,
  };
}

function calcAbbey(rollFn: (faces: number) => number = d) {
  const name = calcAbbeyName(rollFn);
  const size = randomOptionEntry(tableAbbeySize, rollFn);
  const monks =
    size.result === 'Small' ? rollFn(4) * 10 + 20 : rollFn(24) * 10 + 90;
  const abbotLevel =
    9 +
    (size.result === 'Small'
      ? monks >= 50
        ? 1
        : 0
      : Math.floor(monks / 100));
  return {
    name,
    size,
    monks,
    abbot: { level: abbotLevel },
    structure: abbeyStructure,
    coreLocations: abbeyCoreLocations,
    additionalLocations: calcAbbeyAdditionalLocations(rollFn),
    activities: calcAbbeyActivities(rollFn),
    fame: calcAbbeyFame(size.result, rollFn),
    event: calcAbbeyEvent(rollFn),
    history: calcAbbeyHistory(rollFn),
  };
}

export {
  calcAbbey,
  calcAbbeyActivities,
  calcAbbeyAdditionalLocations,
  calcAbbeyEvent,
  calcAbbeyFame,
  calcAbbeyHistory,
  calcAbbeyName,
  calcCastle,
  calcCastleDefense,
  calcCastleDisposition,
  calcCastleEvent,
  calcCastleGarrison,
  calcCastleKeep,
  calcCastleName,
  calcCastleTreasure,
  calcCity,
  calcCityAppearance,
  calcCityBuildings,
  calcCityCharacteristics,
  calcCityDefense,
  calcCityDisposition,
  calcHamlet,
  calcTower,
  calcTowerWizard,
  calcVillage,
  tableAbbeyArtifactNature,
  tableAbbeyEventNature,
  tableAbbeyEventWhen,
  tableAbbeyFame,
  tableAbbeyFarming,
  tableAbbeyHistory,
  tableAbbeyName,
  tableAbbeyRelicSpellLevel,
  tableAbbeyRelicType,
  tableAbbeySaints,
  tableAbbeySize,
  tableCastleCondition,
  tableCastleDefensiveStructures,
  tableCastleDisposition,
  tableCastleMoatEncounter,
  tableCityBuildingType,
  tableCitySize,
  tableHamletDisposition,
  tableHamletLayout,
  tableHamletMainBuilding,
  tableHamletSecret,
  tableTowerAbovegroundLevels,
  tableTowerBottomLevel,
  tableTowerConnection,
  tableTowerDetails,
  tableTowerGroundLevel,
  tableTowerInsideAppearance,
  tableTowerMaterial,
  tableTowerShape,
  tableTowerSpecialEquipment,
  tableTowerTopLevel,
  tableTowerUndergroundLevels,
  tableTowerUndergroundUsage,
  tableTowerWizardLevel
};
