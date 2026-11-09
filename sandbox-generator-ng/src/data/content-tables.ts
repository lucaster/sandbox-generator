import { type RandomTable } from '../domain/random-table';

/**
 * p17
 */
export const tableContentTreasureChance: {
  id: number;
  title: string;
  options: { [key: string]: number | null; };
} = {
  id: 7,
  title: 'Content and Treasure Chance',
  options: {
    'Hazard': 0.25,
    'Empty': 0.15,
    'Special': null, // variable: the DM chooses the reward
    'Monsters': 0.50,
  },
};
export const tableContentConvey: RandomTable = {
  id: 30,
  title: 'Content Convey',
  options: {
    1: 'Clues left by monsters',
    2: 'Depicted on an old fresco/mosaic',
    3: 'Etched/Drawn on something',
    4: 'Told by a (dying) NPC',
    5: 'Vision when near the landmark',
    6: 'Written in a book or on a scroll',
  },
};
const tableContentHazard: RandomTable = {
  id: 28,
  title: 'Content Hazard',
  options: {
    1: 'Acid pits',
    2: 'Allergenic plants',
    3: 'Ancient dormant illness',
    4: 'Curse',
    5: 'Dangerous footing',
    6: 'Easy to get lost',
    7: 'Fog',
    8: 'Fumes (smoke, toxic, etc.)',
    9: 'Ghosts',
    10: 'Hallucinogenic spores',
    11: 'Hidden pits',
    12: 'Hunting traps',
    13: 'Magic corruption',
    14: 'Plague',
    15: 'Quicksands',
    16: 'Radiations',
    17: 'Sabotage/Trap',
    18: 'Unstable/Likely to break',
    19: 'Venomous animals (hornets, snakes, scorpions, etc.)',
    20: 'Volcanic area',
  },
};
/**
 * Contains info that can be learned in the hex
 */
const tableContentEmpty: RandomTable = {
  id: 29,
  title: 'Content Empty (Learnable info)',
  options: {
    1: 'Info. about nearby monsters (ecology, lair, weakness, etc.)',
    2: 'Info. about nearby monsters (ecology, lair, weakness, etc.)',
    3: 'Info. about nearby monsters (ecology, lair, weakness, etc.)',
    4: 'Info. about nearby monsters (ecology, lair, weakness, etc.)',
    5: 'Info. about nearby monsters (ecology, lair, weakness, etc.)',
    6: 'Alchemy recipe',
    7: 'Curative effects (water, plant)',
    8: 'Directions to a settlement',
    9: 'Dungeon location',
    10: 'Future event',
    11: 'Important past event',
    12: 'Legend/Myth',
    13: 'Local custom',
    14: 'Password',
    15: 'Secret passage location',
    16: 'Spell/Ritual',
    17: 'Tale about a magic weapon',
    18: 'Toxicity of something',
    19: 'Upcoming weather',
    20: 'Words from a (random) monster language',
  },
};
const tableContentSpecialArbitrateADispute: RandomTable = {
  id: 32,
  title: 'Content Special Arbitrate a Dispute',
  options: {
    1: 'Adultery',
    2: 'Broken trade agreement',
    3: 'Division of an inheritance',
    4: 'Murder investigation',
    5: 'Territorial boundaries',
    6: 'Trial',
  },
};
const tableContentSpecialPreventAThread: RandomTable = {
  id: 33,
  title: 'Content Special Prevent a Threat',
  options: {
    1: 'Evil ceremony',
    2: 'Flood',
    3: 'Frenzied migratory animals',
    4: 'Magic corruption',
    5: 'Plague',
    6: 'Wildfire',
  },
};
const tableContentSpecialUncoverAMystery: RandomTable = {
  id: 34,
  title: 'Content Special Uncover a Mystery',
  options: {
    1: 'Abductions',
    2: 'Alleged ghost',
    3: 'Curse',
    4: 'Miracle',
    5: 'Missing items',
    6: 'Mutations',
    7: 'Odd footprints/tracks',
    8: 'Stalker',
    9: 'Strange lights/noises',
    10: 'Unexplained deaths',
  },
};
const tableContentSpecialMonsterNpcInNeed: RandomTable = {
  id: 35,
  title: 'Content Special NPC(s)/Monster(s) in need',
  options: {
    1: 'Amnesia',
    2: 'Attacked/Chased',
    3: 'Disappearance',
    4: 'Hunger/Thirst',
    5: 'Imprisoned/Enslaved',
    6: 'Injured/Sick',
    7: 'Lost',
    8: 'Stuck/Bogged down',
    9: 'Theft',
    10: 'Trapped',
  },
};
const tableContentSpecialRelatedToLandmark: RandomTable = {
  id: 31,
  title: 'Content Special Related to Landmark',
  options: {
    1: {
      text: 'Arbitrate a dispute',
      nextTable: tableContentSpecialArbitrateADispute,
    },
    2: {
      text: 'Prevent a threat',
      nextTable: tableContentSpecialPreventAThread,
    },
    3: 'Solve a puzzle/riddle',
    4: {
      text: 'Uncover a mystery',
      nextTable: tableContentSpecialUncoverAMystery,
    },
    5: {
      text: 'Uncover a mystery',
      nextTable: tableContentSpecialUncoverAMystery,
    },
    6: {
      text: 'Uncover a mystery',
      nextTable: tableContentSpecialUncoverAMystery,
    },
  },
};
const tableContentSpecial: RandomTable = {
  id: 31,
  title: 'Content Special',
  options: {
    1: {
      text: 'Arbitrate a dispute',
      nextTable: tableContentSpecialArbitrateADispute,
    },
    2: {
      text: 'Prevent a threat',
      nextTable: tableContentSpecialPreventAThread,
    },
    3: 'Solve a puzzle/riddle',
    4: {
      text: 'Uncover a mystery',
      nextTable: tableContentSpecialUncoverAMystery,
    },
    5: {
      text: 'Uncover a mystery',
      nextTable: tableContentSpecialUncoverAMystery,
    },
    6: {
      text: 'Uncover a mystery',
      nextTable: tableContentSpecialUncoverAMystery,
    },
    7: {
      text: 'NPC(s)/Monster(s) in need',
      nextTable: tableContentSpecialMonsterNpcInNeed,
    },
    8: {
      text: 'NPC(s)/Monster(s) in need',
      nextTable: tableContentSpecialMonsterNpcInNeed,
    },
    9: {
      text: 'NPC(s)/Monster(s) in need',
      nextTable: tableContentSpecialMonsterNpcInNeed,
    },
    10: {
      text: 'Related to landmark',
      nextTable: tableContentSpecialRelatedToLandmark,
    },
    11: {
      text: 'Related to landmark',
      nextTable: tableContentSpecialRelatedToLandmark,
    },
    12: {
      text: 'Related to landmark',
      nextTable: tableContentSpecialRelatedToLandmark,
    },
  },
};
export const tableContent: RandomTable = {
  id: 6,
  title: 'Content',
  options: {
    1: {
      text: 'Hazard',
      nextTable: tableContentHazard,
    },
    2: {
      text: 'Empty', // (Learnable info)
      nextTable: tableContentEmpty,
    },
    3: {
      text: 'Empty', // (Learnable info)
      nextTable: tableContentEmpty,
    },
    4: {
      text: 'Special',
      nextTable: tableContentSpecial,
    },
    5: 'Monsters',
    6: 'Monsters',
  },
};

