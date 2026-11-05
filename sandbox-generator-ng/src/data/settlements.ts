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
  const results: { key: number; result: string }[] = [];
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
    : randomOptionEntry(tableVillageRulerDisposition, rollFn).key <= 4
      ? villageDisposition // Same as villagers
      : oppositeOptionEntry(villageDisposition.key, tableVillageDisposition); // Opposite (to as villagers)
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
  while (second.key === first.key) {
    second = randomOptionEntry(tableCityCharacteristics, rollFn);
  }
  return [first, second]
    .filter((entry) => entry.result !== 'Nothing')
    .map((entry) => entry.result);
}

function calcCityAppearance(rollFn: (faces: number) => number = d) {
  const appearance = randomOptionEntry(tableCityAppearance, rollFn);
  if (appearance.key === 20) {
    const colorScheme = randomOptionEntry(tableCityColorScheme, rollFn);
    return {
      key: appearance.key,
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
      : randomOptionEntry(tableCityRulerDisposition, rollFn).key <= 4
        ? cityDisposition // Same as citizens
        : oppositeOptionEntry(cityDisposition.key, tableCityDisposition); // Opposite (to as citizens)
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

export {
  calcCity,
  calcCityAppearance,
  calcCityBuildings,
  calcCityCharacteristics,
  calcCityDefense,
  calcCityDisposition,
  calcHamlet,
  calcVillage,
  tableCityBuildingType,
  tableCitySize,
  tableHamletDisposition,
  tableHamletLayout,
  tableHamletMainBuilding,
  tableHamletSecret
};

