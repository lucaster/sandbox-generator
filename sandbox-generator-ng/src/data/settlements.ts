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

export {
  calcHamlet,
  calcVillage,
  tableHamletDisposition,
  tableHamletLayout,
  tableHamletMainBuilding,
  tableHamletSecret
};

