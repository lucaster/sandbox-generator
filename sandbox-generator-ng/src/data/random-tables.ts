import { type RandomTable } from '../domain/random-table';

export const tableStartingHexBiome: RandomTable = {
  id: 0,
  title: 'Starting Hex Biome',
  options: {
    1: 'Grassland',
    2: 'Grassland',
    3: 'Grassland',
    4: 'Grassland',
    5: 'Forest',
    6: 'Forest',
    7: 'Hills',
    8: 'Hills',
    9: 'Marsh',
    10: 'Mountains',
  },
};

export const tableStartingHexFeature: RandomTable = {
  id: 1,
  title: 'Starting Hex Feature',
  options: {
    1: 'Village',
  }
};

export const tableNextHexBiome: RandomTable = {
  id: 2,
  title: 'Next Hex Biome',
  options: {
    1: 'Same as previous hex',
    2: 'Same as previous hex',
    3: 'Same as previous hex',
    4: 'Same as previous hex',
    5: 'Same as previous hex',
    6: 'Grassland',
    7: 'Forest',
    8: 'Hills',
    9: 'Marsh',
    10: 'Mountains',
  },
};

const tableSettlement: RandomTable = {
  id: 4,
  title: 'Settlement',
  options: {
    1: 'Hamlet',
    2: 'Village',
    3: 'City',
    4: 'Castle',
    5: 'Tower',
    6: 'Abbey',
  }
}

const tableLandmarkNaturalFauna: RandomTable = {
  id: 8,
  title: 'Landmark Natural Fauna',
  options: {
    1: 'Animal boneyard',
    2: 'Anthill',
    3: 'Beaver dam',
    4: 'Giant animal skeleton',
    5: 'Giant bird nest',
    6: 'Giant snail shell',
    7: 'Huge galleries',
    8: 'Location covered with crows',
    9: 'Predator\'s hunting ground',
    10: 'Ransacked area',
  },
};
const tableLandmarkNaturalVegetalA: RandomTable = {
  id: 9,
  title: 'Landmark Natural Vegetal A',
  options: {
    1: 'Burnt area',
    2: 'Bramble overgrown area',
    3: 'Centennial tree',
    4: 'Dead tree',
    5: 'Exotic tree',
    6: 'Fallen tree',
    7: 'Flower circle',
    8: 'Fruit tree',
    9: 'Giant flower',
    10: 'Giant mushroom',
  },
};
const tableLandmarkNaturalGeologicalA: RandomTable = {
  id: 10,
  title: 'Landmark Natural Geologyical A',
  options: {
    1: 'Animal shaped rock',
    2: 'Cave',
    3: 'Chasm',
    4: 'Crater',
    5: 'Crystalline proliferation',
    6: 'Giant crystal',
    7: 'Lava pool',
    8: 'Mudpit',
    9: 'Stone arch',
    10: 'Stone bridge',
  },
};
const tableLandmarkNaturalVegetalB: RandomTable = {
  id: 11,
  title: 'Landmark Natural Vegetal B',
  options: {
    1: 'Hollow tree',
    2: 'Impenetrable thicket',
    3: 'Mushroom circle',
    4: 'Mycelial proliferation',
    5: 'Rare plant spot',
    6: 'Root arch',
    7: 'Overgrowth',
    8: 'Rare plant spot',
    9: 'Tree alignment',
    10: 'Water-filled plant',
  },
};
const tableLandmarkNaturalGeologicalB: RandomTable = {
  id: 12,
  title: 'Landmark Natural Geological B',
  options: {
    1: 'Pit',
    2: 'Precious metal vein',
    3: 'Ravine',
    4: 'Rift',
    5: 'Rock needle',
    6: 'Rock hole',
    7: 'Scree',
    8: 'Sinkhole',
    9: 'Stone stairs',
    10: 'Very big rock',
  },
};
const tableLandmarkNaturalWater: RandomTable = {
  id: 13,
  title: 'Landmark Natural Water',
  options: {
    1: 'Ford',
    2: 'Hotspring',
    3: 'Lake',
    4: 'Pond',
    5: 'Rapids',
    6: 'River',
    7: 'Spring',
    8: 'Stream',
    9: 'Waterfall',
    10: 'Water-filled cave',
  },
};
const tableLandmarkNatural: RandomTable = {
  id: 14,
  title: 'Landmark Natural',
  options: {
    1: {
      text: 'Fauna',
      nextTable: tableLandmarkNaturalFauna,
    },
    2: {
      text: 'Geological A',
      nextTable: tableLandmarkNaturalGeologicalA,
    },
    3: {
      text: 'Geological B',
      nextTable: tableLandmarkNaturalGeologicalB,
    },
    4: {
      text: 'Vegetal A',
      nextTable: tableLandmarkNaturalVegetalA,
    },
    5: {
      text: 'Vegetal B',
      nextTable: tableLandmarkNaturalVegetalB,
    },
    6: {
      text: 'Water',
      nextTable: tableLandmarkNaturalWater,
    },
  },
};
const tableLandmarkArtificialLabor: RandomTable = {
  id: 15,
  title: 'Landmark Artificial Labor',
  options: {
    1: 'Barn',
    2: 'Felled trees',
    3: 'Field',
    4: 'Granary',
    5: 'Labor camp',
    6: 'Meadow',
    7: 'Quarry',
    8: 'Straw man',
    9: 'Swidden field',
    10: 'Water tower',
  },
};
const tableLandmarkArtificialMysterious: RandomTable = {
  id: 16,
  title: 'Landmark Artificial Mysterious',
  options: {
    1: 'Carved rock',
    2: 'Dolmen',
    3: 'Hanging bones',
    4: 'Heads on spikes',
    5: 'Masks',
    6: 'Pile of bones',
    7: 'Rock stack',
    8: 'Standing stones',
    9: 'Straw dolls',
    10: 'Totem',
  },
};
const tableLandmarkArtificialReligious: RandomTable = {
  id: 17,
  title: 'Landmark Artificial Religious',
  options: {
    1: 'Bell/Gong',
    2: 'Calvary',
    3: 'Cemetery',
    4: 'Cross',
    5: 'Holy place',
    6: 'Idol',
    7: 'Shrine',
    8: 'Tomb',
    9: 'Tumulus',
    10: 'Vault',
  },
};
const tableLandmarkArtificialRuin: RandomTable = {
  id: 18,
  title: 'Landmark Artificial Ruin',
  options: {
    1: 'Abandoned tavern',
    2: 'Burnt barn',
    3: 'Collapsed mine entrance',
    4: 'Decrepit mansion',
    5: 'Destroyed house',
    6: 'Desecrated church',
    7: 'Overgrown tower',
    8: 'Pile of rubble',
    9: 'Razed village',
    10: 'Ruined castle',
  },
};
const tableLandmarkArtificialSmallStructure: RandomTable = {
  id: 19,
  title: 'Landmark Artificial Small Structure',
  options: {
    1: 'Bench',
    2: 'Bivouac area',
    3: 'Gazebo',
    4: 'Hunter’s cabin',
    5: 'Hunting tower',
    6: 'Kennel',
    7: 'Outhouse',
    8: 'Palisade',
    9: 'Well',
    10: 'Wooden fence',
  },
};
const tableLandmarkArtificialTravel: RandomTable = {
  id: 20,
  title: 'Landmark Artificial Travel',
  options: {
    1: 'Boardwalks',
    2: 'Boundary stone',
    3: 'Bridge',
    4: 'Broken bridge',
    5: 'Danger sign',
    6: 'Ledge',
    7: 'Signboard',
    8: 'Stairs',
    9: 'Suspension bridge',
    10: 'Zipline',
  },
};
const tableLandmarkArtificial: RandomTable = {
  id: 20,
  title: 'Landmark Artificial',
  options: {
    1: {
      text: 'Labor',
      nextTable: tableLandmarkArtificialLabor,
    },
    2: {
      text: 'Mysterious',
      nextTable: tableLandmarkArtificialMysterious,
    },
    3: {
      text: 'Religious',
      nextTable: tableLandmarkArtificialReligious,
    },
    4: {
      text: 'Ruin',
      nextTable: tableLandmarkArtificialRuin,
    },
    5: {
      text: 'Small Structure',
      nextTable: tableLandmarkArtificialSmallStructure,
    },
    6: {
      text: 'Travel',
      nextTable: tableLandmarkArtificialTravel,
    },
  },
};
const tableLandmarkMagicAreaUnderASpell: RandomTable = {
  id: 21,
  title: 'Landmark Magic Area Under a Spell',
  options: {
    1: 'Anti-magic zone',
    2: 'Always snowy area',
    3: 'Area where nothing grows',
    4: 'Bad luck area',
    5: 'Dead come back as ghosts',
    6: 'Dome of darkness',
    7: 'Force field',
    8: 'Incessant cyclone',
    9: 'Protection from Evil',
    10: 'Time is frozen',
  },
};
const tableLandmarkMagicEnchangedItem: RandomTable = {
  id: 22,
  title: 'Landmark Magic Enchanted Item',
  options: {
    1: 'Curative basin',
    2: 'Enchanted bell',
    3: 'Fertility stone',
    4: 'Magic fountain/spring',
    5: 'Magic fruits tree',
    6: 'Mutation pit',
    7: 'Stone of knowledge',
    8: 'Sword stuck in a rock',
    9: 'Visions pool',
    10: 'Witch cauldron',
  },
};
const tableLandmarkMagicMagicPath: RandomTable = {
  id: 23,
  title: 'Landmark Magic Magic Path',
  options: {
    1: 'Breathable water',
    2: 'Glowing mushrooms trail',
    3: 'Invisible bridge',
    4: 'Levitating staircase',
    5: 'Magic mirror',
    6: 'Illusion path',
    7: 'Rainbow bridge',
    8: 'Riddle bridge',
    9: 'Walkable water',
    10: 'Wormhole',
  },
};
const tableLandmarkMagicMagicRemains: RandomTable = {
  id: 24,
  title: 'Landmark Magic Magic Remains',
  options: {
    1: 'Area covered with fairy dust',
    2: 'Bloody altar',
    3: 'Corpse covered in crystals',
    4: 'Corrupt area',
    5: 'Destroyed golem',
    6: 'Magic battlefield',
    7: 'Old shrine',
    8: 'Petrified travelers',
    9: 'Remnants of a ceremony',
    10: 'Signs of an explosion',
  },
};
const tableLandmarkMagicPlaceOfPower: RandomTable = {
  id: 25,
  title: 'Landmark Magic Place of Power',
  options: {
    1: 'Ancient burial grounds',
    2: 'Birthplace/Tomb of a saint',
    3: 'Magic beacon',
    4: 'Mana well',
    5: 'Neolithic rock monument',
    6: 'Root of the World Tree',
    7: 'Preserved natural place',
    8: 'Sacred waters',
    9: 'Sun focal point',
    10: 'Ziggurat of old',
  },
};
const tableLandmarkMagicStrangePhenomenon: RandomTable = {
  id: 26,
  title: 'Landmark Magic Strange Phenomenon',
  options: {
    1: 'Evermelting ice',
    2: 'Everburning tree',
    3: 'Floating crystal',
    4: 'Ghost building',
    5: 'Luminous engravings',
    6: 'Reverse waterfall',
    7: 'Singing crystal',
    8: 'Strong magnetism',
    9: 'Talking rock',
    10: 'Whispers in the wind',
  },
};
const tableLandmarkMagic: RandomTable = {
  id: 27,
  title: 'Landmark Magic',
  options: {
    1: {
      text: 'Area Under a Spell',
      nextTable: tableLandmarkMagicAreaUnderASpell,
    },
    2: {
      text: 'Enchanted Item',
      nextTable: tableLandmarkMagicEnchangedItem,
    },
    3: {
      text: 'Magic Path',
      nextTable: tableLandmarkMagicMagicPath,
    },
    4: {
      text: 'Magic Remains',
      nextTable: tableLandmarkMagicMagicRemains,
    },
    5: {
      text: 'Place of Power',
      nextTable: tableLandmarkMagicPlaceOfPower,
    },
    6: {
      text: 'Strange Phenomenon',
      nextTable: tableLandmarkMagicStrangePhenomenon,
    },
  },
};
const tableLandmark: RandomTable = {
  id: 5,
  title: 'Landmark',
  options: {
    1: {
      text: 'Natural',
      nextTable: tableLandmarkNatural,
    },
    2: {
      text: 'Natural',
      nextTable: tableLandmarkNatural,
    },
    3: {
      text: 'Natural',
      nextTable: tableLandmarkNatural,
    },
    4: {
      text: 'Artificial',
      nextTable: tableLandmarkArtificial,
    },
    5: {
      text: 'Artificial',
      nextTable: tableLandmarkArtificial,
    },
    6: {
      text: 'Magic',
      nextTable: tableLandmarkMagic,
    },
  },
};

/**
 * p17
 */
const tableContentTreasureChance = {
  id: 7,
  title: 'Content and Treasure Chance',
  options: {
    'Hazard': 0.25,
    'Empty': 0.15,
    'Special': 0.50, // variable (TODO)
    'Monsters': 0.50,
  },
};
const tableContentConvey: RandomTable = {
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

export const tableNextHexFeature: RandomTable = {
  id: 3,
  title: 'Next Hex Feature',
  options: {
    1: {
      text: 'Landmark',
      nextTable: tableLandmark,
    },
    2: {
      text: 'Landmark',
      nextTable: tableLandmark,
    },
    3: {
      text: 'Landmark',
      nextTable: tableLandmark,
    },
    4: {
      text: 'Settlement',
      nextTable: tableSettlement,
    },
    5: 'Lair',
    6: 'Dungeon',
  },
};
