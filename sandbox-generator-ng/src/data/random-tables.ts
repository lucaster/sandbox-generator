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

const settlementTable: RandomTable = {
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

const landmarkNaturalFaunaTable: RandomTable = {
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
const landmarkNaturalVegetalATable: RandomTable = {
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
const landmarkNaturalGeologicalATable: RandomTable = {
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
const landmarkNaturalVegetalBTable: RandomTable = {
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
const landmarkNaturalGeologicalBTable: RandomTable = {
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
const landmarkNaturalWaterTable: RandomTable = {
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
const landmarkNaturalTable: RandomTable = {
  id: 14,
  title: 'Landmark Natural',
  options: {
    1: {
      text: 'Fauna',
      nextTable: landmarkNaturalFaunaTable,
    },
    2: {
      text: 'Geological A',
      nextTable: landmarkNaturalGeologicalATable,
    },
    3: {
      text: 'Geological B',
      nextTable: landmarkNaturalGeologicalBTable,
    },
    4: {
      text: 'Vegetal A',
      nextTable: landmarkNaturalVegetalATable,
    },
    5: {
      text: 'Vegetal B',
      nextTable: landmarkNaturalVegetalBTable,
    },
    6: {
      text: 'Water',
      nextTable: landmarkNaturalWaterTable,
    },
  },
};
const landmarkArtificialLaborTable: RandomTable = {
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
const landmarkArtificialMysteriousTable: RandomTable = {
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
const landmarkArtificialReligiousTable: RandomTable = {
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
const landmarkArtificialRuinTable: RandomTable = {
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
const landmarkArtificialSmallStructureTable: RandomTable = {
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
const landmarkArtificialTravelTable: RandomTable = {
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
const landmarkArtificialTable: RandomTable = {
  id: 20,
  title: 'Landmark Artificial',
  options: {
    1: {
      text: 'Labor',
      nextTable: landmarkArtificialLaborTable,
    },
    2: {
      text: 'Mysterious',
      nextTable: landmarkArtificialMysteriousTable,
    },
    3: {
      text: 'Religious',
      nextTable: landmarkArtificialReligiousTable,
    },
    4: {
      text: 'Ruin',
      nextTable: landmarkArtificialRuinTable,
    },
    5: {
      text: 'Small Structure',
      nextTable: landmarkArtificialSmallStructureTable,
    },
    6: {
      text: 'Travel',
      nextTable: landmarkArtificialTravelTable,
    },
  },
};
const landmarkMagicAreaUnderASpellTable: RandomTable = {
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
const landmarkMagicEnchangedItemTable: RandomTable = {
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
const landmarkMagicMagicPathTable: RandomTable = {
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
const landmarkMagicMagicRemainsTable: RandomTable = {
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
const landmarkMagicPlaceOfPowerTable: RandomTable = {
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
const landmarkMagicStrangePhenomenonTable: RandomTable = {
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
const landmarkMagicTable: RandomTable = {
  id: 27,
  title: 'Landmark Magic',
  options: {
    1: {
      text: 'Area Under a Spell',
      nextTable: landmarkMagicAreaUnderASpellTable,
    },
    2: {
      text: 'Enchanted Item',
      nextTable: landmarkMagicEnchangedItemTable,
    },
    3: {
      text: 'Magic Path',
      nextTable: landmarkMagicMagicPathTable,
    },
    4: {
      text: 'Magic Remains',
      nextTable: landmarkMagicMagicRemainsTable,
    },
    5: {
      text: 'Place of Power',
      nextTable: landmarkMagicPlaceOfPowerTable,
    },
    6: {
      text: 'Strange Phenomenon',
      nextTable: landmarkMagicStrangePhenomenonTable,
    },
  },
};
const landmarkTable: RandomTable = {
  id: 5,
  title: 'Landmark',
  options: {
    1: {
      text: 'Natural',
      nextTable: landmarkNaturalTable,
    },
    2: {
      text: 'Natural',
      nextTable: landmarkNaturalTable,
    },
    3: {
      text: 'Natural',
      nextTable: landmarkNaturalTable,
    },
    4: {
      text: 'Artificial',
      nextTable: landmarkArtificialTable,
    },
    5: {
      text: 'Artificial',
      nextTable: landmarkArtificialTable,
    },
    6: {
      text: 'Magic',
      nextTable: landmarkMagicTable,
    },
  },
};

/**
 * p17
 */
const foundTable: RandomTable = {
  id: 6,
  title: 'Found',
  options: {
    1: 'Hazard',
    2: 'Empty',
    3: 'Empty',
    4: 'Special',
    5: 'Monsters',
    6: 'Monsters',
  },
};
const foundAndTreasureChanceTable = {
  id: 7,
  title: 'Found and Treasure Chance',
  options: {
    'Hazard': 0.25,
    'Empty': 0.15,
    'Special': 0.50, // variable (TODO)
    'Monsters': 0.55,
  },
};

export const tableNextHexFeature: RandomTable = {
  id: 3,
  title: 'Next Hex Feature',
  options: {
    1: {
      text: 'Landmark',
      nextTable: landmarkTable,
    },
    2: {
      text: 'Landmark',
      nextTable: landmarkTable,
    },
    3: {
      text: 'Landmark',
      nextTable: landmarkTable,
    },
    4: {
      text: 'Settlement',
      nextTable: settlementTable,
    },
    5: 'Lair',
    6: 'Dungeon',
  },
};
