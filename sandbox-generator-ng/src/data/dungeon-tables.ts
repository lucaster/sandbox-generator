import { type RandomTable } from '../domain/random-table';

// Book: Dungeons > Cross section > 1) Areas, p. 64.
export const tableDungeonAreaNamePrefix: RandomTable = {
  id: 206,
  title: 'Dungeon Area Name Prefix',
  options: {
    1: '... of Death',
    2: '... of Doom',
    3: '... of Evil',
    4: 'Black ...',
    5: 'Bloody ...',
    6: 'Crumbling ...',
    7: 'Deadly ...',
    8: 'Desolated ...',
    9: 'Destroyed ...',
    10: 'Forgotten ...',
    11: 'Haunted ...',
    12: 'Hellish ...',
    13: 'Infernal ...',
    14: 'Mossy ...',
    15: 'Mourning ...',
    16: 'Overgrown ...',
    17: 'Scarlet ...',
    18: 'Secret ...',
    19: 'Twilight ...',
    20: 'Unholy ...',
  },
};

// Book: Dungeons > Cross section > 1) Areas, p. 64.
export const tableDungeonAreaNameNoun: RandomTable = {
  id: 207,
  title: 'Dungeon Area Name Noun',
  options: {
    1: 'Burrow(s)',
    2: 'Cavern(s)',
    3: 'Cell(s)',
    4: 'Chamber(s)',
    5: 'Corridor(s)',
    6: 'Delve',
    7: 'Grotto',
    8: 'Labyrinth',
    9: 'Maze',
    10: 'Pit(s)',
    11: 'Tomb(s)',
    12: 'Tunnel(s)',
  },
};

// Book: Dungeons > Cross section > 1) Areas, p. 64.
export const tableDungeonAreaTheme: RandomTable = {
  id: 208,
  title: 'Dungeon Area Theme',
  options: {
    1: 'None',
    2: 'None',
    3: 'None',
    4: 'None',
    5: 'None',
    6: 'None',
    7: 'None',
    8: 'None',
    9: 'None',
    10: 'None',
    11: 'None',
    12: 'None',
    13: 'Burnt',
    14: 'Crystalline',
    15: 'Demonic',
    16: 'Flooded',
    17: 'Fortified',
    18: 'Fungal',
    19: 'Haunted',
    20: 'Vegetal',
  },
};

// Book: Dungeons > Cross section > 3) Links, p. 65.
export const tableDungeonCrossSectionLinks: RandomTable = {
  id: 209,
  title: 'Links Leaving a Level',
  options: {
    1: 'Zero',
    2: 'Zero',
    3: 'Zero',
    4: 'Zero',
    5: 'One',
    6: 'One',
    7: 'Two',
    8: 'One (secret door or stairs)',
  },
};

// Book: Dungeons > Cross section > 3) Links, p. 65.
export const tableDungeonLinkTarget: RandomTable = {
  id: 210,
  title: 'Link Target (Same Depth Available)',
  options: {
    1: 'Same level',
    2: 'Same level',
    3: 'Same level',
    4: 'Same level',
    5: 'Above',
    6: 'Below',
  },
};

// Book: Dungeons > Cross section > 3) Links, p. 65.
export const tableDungeonLinkTargetWithoutSameDepth: RandomTable = {
  id: 211,
  title: 'Link Target (No Same Depth Available)',
  options: {
    1: 'Above',
    2: 'Above',
    3: 'Above',
    4: 'Below',
    5: 'Below',
    6: 'Below',
  },
};

// Book: Dungeons > Cross section > 3) Links, p. 65 (50% rule; derived from the text).
export const tableDungeonSublevelLink: RandomTable = {
  id: 212,
  title: 'Sub-level Link',
  options: {
    1: 'Linked',
    2: 'Not linked',
  },
};

// Book: Dungeons > Levels > 1) Factions, p. 66.
export const tableDungeonFactionCount: RandomTable = {
  id: 213,
  title: 'Dungeon Faction Count',
  options: {
    1: 'Two',
    2: 'Two',
    3: 'Two',
    4: 'Three',
    5: 'Three',
    6: 'One',
  },
};

// Book: Dungeons > Levels > 1) Factions, p. 66.
export const tableDungeonMonsterLevelDepthI: RandomTable = {
  id: 214,
  title: 'Monster Level by Depth I',
  dice: '1d12',
  options: {
    1: '1',
    2: '1',
    3: '1',
    4: '1',
    5: '1',
    6: '1',
    7: '1',
    8: '1',
    9: '1',
    10: '2',
    11: '2',
    12: '3',
  },
};

// Book: Dungeons > Levels > 1) Factions, p. 66.
export const tableDungeonMonsterLevelDepthII: RandomTable = {
  id: 215,
  title: 'Monster Level by Depth II',
  dice: '1d12',
  options: {
    1: '1',
    2: '1',
    3: '1',
    4: '2',
    5: '2',
    6: '2',
    7: '2',
    8: '2',
    9: '2',
    10: '3',
    11: '3',
    12: '4',
  },
};

// Book: Dungeons > Levels > 1) Factions, p. 66.
export const tableDungeonMonsterLevelDepthIII: RandomTable = {
  id: 216,
  title: 'Monster Level by Depth III',
  dice: '1d12',
  options: {
    1: '1',
    2: '2',
    3: '2',
    4: '3',
    5: '3',
    6: '3',
    7: '3',
    8: '3',
    9: '3',
    10: '4',
    11: '4',
    12: '5',
  },
};

// Book: Dungeons > Levels > 1) Factions, p. 66.
export const tableDungeonMonsterLevelDepthIV: RandomTable = {
  id: 217,
  title: 'Monster Level by Depth IV',
  dice: '1d12',
  options: {
    1: '1',
    2: '2',
    3: '2',
    4: '3',
    5: '3',
    6: '3',
    7: '3',
    8: '3',
    9: '3',
    10: '4',
    11: '4',
    12: '5',
  },
};

// Book: Dungeons > Levels > 1) Factions, p. 66.
export const tableDungeonMonsterLevelDepthV: RandomTable = {
  id: 218,
  title: 'Monster Level by Depth V',
  dice: '1d12',
  options: {
    1: '1',
    2: '2',
    3: '2',
    4: '3',
    5: '3',
    6: '3',
    7: '3',
    8: '3',
    9: '3',
    10: '4',
    11: '4',
    12: '4',
  },
};

// Book: Dungeons > Levels > 1) Factions, p. 66.
export const tableDungeonMonsterLevelDepthVI: RandomTable = {
  id: 219,
  title: 'Monster Level by Depth VI',
  dice: '1d12',
  options: {
    1: '1',
    2: '2',
    3: '2',
    4: '3',
    5: '3',
    6: '3',
    7: '3',
    8: '3',
    9: '3',
    10: '3',
    11: '3',
    12: '3',
  },
};

export const tableDungeonMonsterLevelByDepth: Record<1 | 2 | 3 | 4 | 5 | 6, RandomTable> = {
  1: tableDungeonMonsterLevelDepthI,
  2: tableDungeonMonsterLevelDepthII,
  3: tableDungeonMonsterLevelDepthIII,
  4: tableDungeonMonsterLevelDepthIV,
  5: tableDungeonMonsterLevelDepthV,
  6: tableDungeonMonsterLevelDepthVI,
};

// Book: Dungeons > Levels > 1) Factions, p. 66.
export const tableDungeonMonsterTypesLevel1: RandomTable = {
  id: 220,
  title: 'Level 1 Dungeon Monsters',
  dice: '1d10',
  options: {
    1: 'Bandits',
    2: 'Dwarves/Elves',
    3: 'Giant centipedes',
    4: 'Giant rats',
    5: 'Goblins',
    6: 'Kobolds',
    7: 'Orcs',
    8: 'Pixies',
    9: 'Skeletons',
    10: 'Stirges',
  },
};

// Book: Dungeons > Levels > 1) Factions, p. 66.
export const tableDungeonMonsterTypesLevel2: RandomTable = {
  id: 221,
  title: 'Level 2 Dungeon Monsters',
  dice: '1d10',
  options: {
    1: 'Berserkers',
    2: 'Cultists',
    3: 'Giant spiders',
    4: 'Ghouls',
    5: 'Gnolls',
    6: 'Hobgoblins',
    7: 'Lizard-men',
    8: 'Troglodytes',
    9: 'Wolves',
    10: 'Zombies',
  },
};

// Book: Dungeons > Levels > 1) Factions, p. 66.
export const tableDungeonMonsterTypesLevel3: RandomTable = {
  id: 222,
  title: 'Level 3 Dungeon Monsters',
  dice: '1d10',
  options: {
    1: 'Bugbears',
    2: 'Giant ants',
    3: 'Giant frogs',
    4: 'Giant lizards',
    5: 'Harpies',
    6: 'Moth-men',
    7: 'Ochre jellies',
    8: 'Ogres',
    9: 'Wererats',
    10: 'Wights',
  },
};

// Book: Dungeons > Levels > 1) Factions, p. 67.
export const tableDungeonMonsterTypesLevel4: RandomTable = {
  id: 223,
  title: 'Level 4 Dungeon Monsters',
  dice: '1d10',
  options: {
    1: 'Doppelgangers',
    2: 'Gargoyles',
    3: 'Ghasts',
    4: 'Giant scorpions',
    5: 'Giant snakes',
    6: 'Giant wasps',
    7: 'Mushroom-men',
    8: 'Skinwalkers',
    9: 'Werewolves',
    10: 'Wraiths',
  },
};

// Book: Dungeons > Levels > 1) Factions, p. 67.
export const tableDungeonMonsterTypesLevel5: RandomTable = {
  id: 224,
  title: 'Level 5 Dungeon Monsters',
  dice: '1d10',
  options: {
    1: 'Cockatrices',
    2: 'Manticores',
    3: 'Medusae',
    4: 'Minotaurs',
    5: 'Mummies',
    6: 'Rust monsters',
    7: 'Satyrs',
    8: 'Specters',
    9: 'Trolls',
    10: 'Wyverns',
  },
};

// Book: Dungeons > Levels > 1) Factions, p. 67.
export const tableDungeonMonsterTypesLevel6: RandomTable = {
  id: 225,
  title: 'Level 6 Dungeon Monsters',
  dice: '1d10',
  options: {
    1: 'Basilisks',
    2: 'Dragons',
    3: 'Evil high priests',
    4: 'Giants',
    5: 'Gorgons',
    6: 'Hydras',
    7: 'Lords (chaotic)',
    8: 'Purple worms',
    9: 'Vampires',
    10: 'Wizards',
  },
};

export const tableDungeonMonsterTypesByLevel: Record<1 | 2 | 3 | 4 | 5 | 6, RandomTable> = {
  1: tableDungeonMonsterTypesLevel1,
  2: tableDungeonMonsterTypesLevel2,
  3: tableDungeonMonsterTypesLevel3,
  4: tableDungeonMonsterTypesLevel4,
  5: tableDungeonMonsterTypesLevel5,
  6: tableDungeonMonsterTypesLevel6,
};

// Book: Dungeons > Levels > 3) Factions relationships, p. 68.
export const tableDungeonFactionRelationship: RandomTable = {
  id: 227,
  title: 'Dungeon Faction Relationship',
  dice: '2d6',
  options: {
    2: 'Open war',
    3: 'Hostility',
    4: 'Hostility',
    5: 'Hostility',
    6: 'Indifference',
    7: 'Indifference',
    8: 'Indifference',
    9: 'Peace/Trade',
    10: 'Peace/Trade',
    11: 'Peace/Trade',
    12: 'Alliance',
  },
};

// Book: Dungeons > Structure > 1) Corridors, p. 70.
export const tableDungeonCorridorLength: RandomTable = {
  id: 228,
  title: 'Corridor Length',
  options: {
    1: 'One section',
    2: 'One section',
    3: 'One section',
    4: 'Two sections',
    5: 'Two sections',
    6: 'Three sections',
  },
};

// Book: Dungeons > Structure > 1) Corridors, p. 70.
export const tableDungeonCorridorFeatures: RandomTable = {
  id: 229,
  title: 'Corridor Features',
  options: {
    1: 'Nothing',
    2: 'Nothing',
    3: 'Nothing',
    4: 'One door',
    5: 'One door',
    6: 'One door',
    7: 'Two doors',
    8: 'Two doors',
    9: 'Two doors',
    10: 'Secret door',
    11: 'Secret door',
    12: 'Trap',
  },
};

// Book: Dungeons > Structure > 1) Corridors, p. 70.
export const tableDungeonCorridorDoorSide: RandomTable = {
  id: 230,
  title: 'Corridor Door Side',
  options: {
    1: 'Left',
    2: 'Left',
    3: 'Left',
    4: 'Right',
    5: 'Right',
    6: 'Right',
  },
};

// Book: Dungeons > Structure > 1) Corridors, p. 70.
export const tableDungeonCorridorEnd: RandomTable = {
  id: 231,
  title: 'Corridor End',
  options: {
    1: 'Dead end (or reroll)',
    2: 'X intersection',
    3: 'T intersection',
    4: 'Left turn',
    5: 'Right turn',
    6: 'Door/Portcullis',
    7: 'Stairs to a deeper level',
    8: 'Stairs to a higher level',
  },
};

// Book: Dungeons > Structure > 2) Rooms, p. 71.
export const tableDungeonRoomSize: RandomTable = {
  id: 232,
  title: 'Room Size',
  options: {
    1: 'Medium (1d4+2)',
    2: 'Medium (1d4+2)',
    3: 'Medium (1d4+2)',
    4: 'Small (1d3+1)',
    5: 'Small (1d3+1)',
    6: 'Large (1d6+3)',
  },
};

// Book: Dungeons > Structure > 2) Rooms, p. 71.
export const tableDungeonRoomShape: RandomTable = {
  id: 233,
  title: 'Room Shape',
  options: {
    1: 'Rectangle/Square',
    2: 'Rectangle/Square',
    3: 'Rectangle/Square',
    4: 'Rectangle/Square',
    5: 'Rectangle/Square',
    6: 'Rectangle/Square',
    7: 'Rectangle/Square',
    8: 'Rectangle/Square',
    9: 'Rectangle/Square',
    10: 'Rectangle/Square',
    11: 'Rectangle/Square',
    12: 'Rectangle/Square',
    13: 'Rectangle/Square',
    14: 'Rectangle/Square',
    15: 'Parallelogram',
    16: 'Trapezium',
    17: 'Pentagon',
    18: 'Hexagon',
    19: 'Octagon',
    20: 'Oval/Circle',
  },
};

// Book: Dungeons > Structure > 2) Rooms, p. 71.
export const tableDungeonRoomType: RandomTable = {
  id: 234,
  title: 'Room Type and Treasure Chance',
  options: {
    1: 'Trap (25%)',
    2: 'Empty (15%)',
    3: 'Empty (15%)',
    4: 'Special (variable)',
    5: 'Monsters (50%)',
    6: 'Monsters (50%)',
  },
};

// Book: Dungeons > Structure > 3) Doors, p. 72.
export const tableDungeonDoorCount: RandomTable = {
  id: 235,
  title: 'Additional Doors in a Room',
  options: {
    1: 'None',
    2: 'None',
    3: 'None',
    4: 'One',
    5: 'One',
    6: 'One',
    7: 'Two',
    8: 'Two',
    9: 'Two',
    10: 'Three',
    11: 'Three',
    12: 'Secret door',
  },
};

// Book: Dungeons > Structure > 3) Doors, p. 72.
export const tableDungeonRoomDoorPosition: RandomTable = {
  id: 236,
  title: 'Room Door Position',
  options: {
    1: 'Front',
    2: 'Front',
    3: 'Left',
    4: 'Left',
    5: 'Right',
    6: 'Right',
  },
};

// Book: Dungeons > Structure > 3) Doors, p. 72.
export const tableDungeonDoorDestination: RandomTable = {
  id: 237,
  title: 'Room Door Destination',
  options: {
    1: 'Room',
    2: 'Room',
    3: 'Room',
    4: 'Corridor',
    5: 'Corridor',
    6: 'Corridor',
  },
};

// Book: Dungeons > Structure > 3) Doors, p. 72.
export const tableDungeonDoorType: RandomTable = {
  id: 238,
  title: 'Door Type',
  options: {
    1: 'Stuck door',
    2: 'Stuck door',
    3: 'Stuck door',
    4: 'Stuck door',
    5: 'Stuck door',
    6: 'Stuck door',
    7: 'Stuck door',
    8: 'Stuck door',
    9: 'Stuck door',
    10: 'Stuck door',
    11: 'Locked wooden door',
    12: 'Locked wooden door',
    13: 'Locked wooden door',
    14: 'Locked wooden door',
    15: 'Locked wooden door',
    16: 'Portcullis',
    17: 'Portcullis',
    18: 'Portcullis',
    19: 'Magic door',
    20: 'Locked metal door',
  },
};

// Book: Dungeons > Structure > 4) Secret doors, p. 73.
export const tableDungeonSecretDoorForm: RandomTable = {
  id: 239,
  title: 'Secret Door Form',
  options: {
    1: 'Camouflaged',
    2: 'Camouflaged',
    3: 'Camouflaged',
    4: 'Camouflaged',
    5: 'In plain sight',
    6: 'In plain sight',
  },
};

// Book: Dungeons > Structure > 4) Secret doors, p. 73.
export const tableDungeonCamouflagedDoorAppearance: RandomTable = {
  id: 240,
  title: 'Camouflaged Secret Door Appearance',
  options: {
    1: 'Looks like the wall',
    2: 'Looks like the wall',
    3: 'Looks like the wall',
    4: 'Looks like the wall',
    5: 'Looks like the wall',
    6: 'Looks like the wall',
    7: 'Illusory wall',
    8: 'Mirror',
    9: 'Painting',
    10: 'Part of a bas-relief',
    11: 'Part of a bookshelf',
    12: 'Wardrobe back panel',
  },
};

// Book: Dungeons > Structure > 4) Secret doors, p. 73.
export const tableDungeonCamouflagedDoorClue: RandomTable = {
  id: 241,
  title: 'Camouflaged Secret Door Clue',
  options: {
    1: 'None',
    2: 'None',
    3: 'None',
    4: 'None',
    5: 'Air flow',
    6: 'Cleaner/Dirtier floor or wall',
    7: 'Clue related to appearance',
    8: 'Different material/color',
    9: 'Footprints',
    10: 'Interrupted trail of blood',
    11: 'Ray of light',
    12: 'Worn out floor',
  },
};

// Book: Dungeons > Structure > 4) Secret doors, p. 73.
export const tableDungeonVisibleSecretDoorType: RandomTable = {
  id: 242,
  title: 'In-Plain-Sight Secret Door Type',
  options: {
    1: 'Metal door with no handle',
    2: 'Metal door with no handle',
    3: 'Metal door with no handle',
    4: 'Metal door with no handle',
    5: 'Metal door with no handle',
    6: 'Wooden door with no handle',
    7: 'Wooden door with no handle',
    8: 'Wall of fire/steam/energy',
  },
};

// Book: Dungeons > Structure > 4) Secret doors, p. 73.
export const tableDungeonSecretDoorMechanism: RandomTable = {
  id: 243,
  title: 'Secret Door Mechanism',
  options: {
    1: 'Align items',
    2: 'Antlers of a deer head',
    3: 'Book in a library',
    4: 'Brick protruding from a wall',
    5: 'Candle holder without a candle/with an unlit candle',
    6: 'Detail of a statue in an unusual position',
    7: 'Extinguish a specific candle',
    8: 'Fireplace poker in a stand',
    9: 'Go through it with confidence',
    10: 'Halberd/Sword of an armor',
    11: 'Hit a target',
    12: 'Insert a missing piece',
    13: 'Insert a sword into a hole',
    14: 'Magical detection of a specific monster',
    15: 'Password',
    16: 'Play a series of notes',
    17: 'Pressure plate',
    18: 'Reverse pressure plate',
    19: 'Thirsty/Hungry mouth',
    20: 'Weapon hanging on the wall behind a shield',
  },
};

// Book: Dungeons > Structure > 5) Magic doors, p. 74.
export const tableDungeonMagicDoorType: RandomTable = {
  id: 244,
  title: 'Magic Door Type',
  options: {
    1: 'Demon door',
    2: 'Demon door',
    3: 'Demon door',
    4: 'Demon door',
    5: 'Demon door',
    6: 'Magic seal',
  },
};

// Book: Dungeons > Structure > 5) Magic doors, p. 74.
export const tableDungeonDemonDoorTask: RandomTable = {
  id: 245,
  title: 'Demon Door Task',
  options: {
    1: 'Bring it a specific item',
    2: 'Do a bad deed in front of it',
    3: 'Find its “key” (any item)',
    4: 'Find its password',
    5: 'Kill a specific monster',
    6: 'Listen to it (lie)',
    7: 'Listen to it (monologue)',
    8: 'Listen to it (warning)',
    9: 'Solve a riddle',
    10: 'Take a leap of faith (metaphorical or not)',
  },
};

// Book: Dungeons > Structure > 6) Traps, p. 74.
export const tableDungeonTrap: RandomTable = {
  id: 246,
  title: 'Dungeon Trap',
  options: {
    1: 'Acid pool',
    2: 'Acid pool',
    3: 'Alarm',
    4: 'Alarm',
    5: 'Banana peel',
    6: 'Banana peel',
    7: 'Blade',
    8: 'Blade',
    9: 'Cage',
    10: 'Cage',
    11: 'Caltrops',
    12: 'Caltrops',
    13: 'Circular saw',
    14: 'Circular saw',
    15: 'Crossbow',
    16: 'Crossbow',
    17: 'Crushed glass',
    18: 'Crushed glass',
    19: 'Crushing ceiling',
    20: 'Crushing ceiling',
    21: 'Crushing wall(s)',
    22: 'Crushing wall(s)',
    23: 'Dart throwers',
    24: 'Dart throwers',
    25: 'Electric shock',
    26: 'Electric shock',
    27: 'Electrified ground',
    28: 'Electrified ground',
    29: 'Elevator to another level',
    30: 'Elevator to another level',
    31: 'Extreme temperature',
    32: 'Extreme temperature',
    33: 'Fills with sand',
    34: 'Fills with sand',
    35: 'Fills with water',
    36: 'Fills with water',
    37: 'Flamethrowers',
    38: 'Flamethrowers',
    39: 'Flammable gas',
    40: 'Flammable gas',
    41: 'Flashing light',
    42: 'Flashing light',
    43: 'Gas (confusion, death, sleep)',
    44: 'Gas (confusion, death, sleep)',
    45: 'Illusory floor',
    46: 'Illusory floor',
    47: 'Landslide',
    48: 'Landslide',
    49: 'Lasso',
    50: 'Lasso',
    51: 'Lava flow',
    52: 'Lava flow',
    53: 'Lava pool',
    54: 'Lava pool',
    55: 'Magic (casts a spell)',
    56: 'Magic (casts a spell)',
    57: 'Mist dispenser',
    58: 'Mist dispenser',
    59: 'Piston',
    60: 'Piston',
    61: 'Pit',
    62: 'Pit',
    63: 'Poisoned caltrops',
    64: 'Poisoned caltrops',
    65: 'Portcullis closing',
    66: 'Portcullis closing',
    67: 'Projectile wall (arrows, etc.)',
    68: 'Projectile wall (arrows, etc.)',
    69: 'Quicksands',
    70: 'Quicksands',
    71: 'Ram',
    72: 'Ram',
    73: 'Rolling stone',
    74: 'Rolling stone',
    75: 'Slippery floor',
    76: 'Slippery floor',
    77: 'Spray (acid, smelly, sticky)',
    78: 'Spray (acid, smelly, sticky)',
    79: 'Sticky ground',
    80: 'Sticky ground',
    81: 'Spike pit',
    82: 'Spike pit',
    83: 'Stretched spiky branch',
    84: 'Stretched spiky branch',
    85: 'Taut rope',
    86: 'Taut rope',
    87: 'Trapdoor (pit)',
    88: 'Trapdoor (pit)',
    89: 'Trapdoor (spike pit)',
    90: 'Trapdoor (spike pit)',
    91: 'Trapdoor (to a lower level)',
    92: 'Trapdoor (to a lower level)',
    93: 'Vacuum chamber',
    94: 'Vacuum chamber',
    95: 'Violent air stream',
    96: 'Violent air stream',
    97: 'Violent water stream',
    98: 'Violent water stream',
    99: 'Wolf trap',
    100: 'Wolf trap',
  },
};

// Book: Dungeons > Structure > 7) Empty rooms, p. 75.
export const tableDungeonEmptyRoom: RandomTable = {
  id: 247,
  title: 'Dungeon Empty Room',
  options: {
    1: 'Abandoned guard post',
    2: 'Alchemy table',
    3: 'Alcoves',
    4: 'Aligned beds',
    5: 'Aligned benches',
    6: 'Altar',
    7: 'Anatomical skeleton',
    8: 'Aquarium',
    9: 'Banquet table',
    10: 'Barrels',
    11: 'Barricade',
    12: 'Bear skin',
    13: 'Bed',
    14: 'Bench',
    15: 'Bloody stains',
    16: 'Broken trap',
    17: 'Carpet',
    18: 'Cells',
    19: 'Chained skeletons',
    20: 'Chains',
    21: 'Charred remains',
    22: 'Corpse nailed to a wall',
    23: 'Crates',
    24: 'Cryogenic/Formaline tubes',
    25: 'Cushions',
    26: 'Dance parquet',
    27: 'Dark area',
    28: 'Desk',
    29: 'Drums',
    30: 'Dummy door',
    31: 'Empty chest',
    32: 'Excavation site',
    33: 'Extinguished campfire',
    34: 'Fireplace',
    35: 'Flooded zone',
    36: 'Fog',
    37: 'Food reserve',
    38: 'Forge',
    39: 'Fountain',
    40: 'Frames on the walls',
    41: 'Fresco',
    42: 'Furnished library',
    43: 'Garbage',
    44: 'Gargoyle',
    45: 'Gears in the walls',
    46: 'Gong',
    47: 'Graffiti',
    48: 'Guano covered floor',
    49: 'Hammock',
    50: 'Hieroglyphics',
    51: 'Idol',
    52: 'Iron maiden',
    53: 'Ivy',
    54: 'Latrines',
    55: 'Leaking water pipe',
    56: 'Leftovers on a table',
    57: 'Mushroom culture',
    58: 'Oil covered floor',
    59: 'Organ',
    60: 'Oubliette',
    61: 'Pedestal',
    62: 'Pentagram',
    63: 'Piano',
    64: 'Pile of ashes (smoking)',
    65: 'Pile of bones',
    66: 'Pile of bricks',
    67: 'Pile of logs',
    68: 'Pile of skulls',
    69: 'Pillars',
    70: 'Pool',
    71: 'Puddle of vomit',
    72: 'Puddles of blood',
    73: 'Religious symbols',
    74: 'Rotting corpse',
    75: 'Rotting library',
    76: 'Rotting tapestries',
    77: 'Rubble',
    78: 'Sarcophagus',
    79: 'Shelf',
    80: 'Showcases',
    81: 'Signs of combat',
    82: 'Sink',
    83: 'Slime',
    84: 'Smokehouse',
    85: 'Stained glass',
    86: 'Statues',
    87: 'Summoning circle',
    88: 'Table and chairs',
    89: 'Throne',
    90: 'Tools',
    91: 'Torture easel',
    92: 'Training dummies',
    93: 'Trophies',
    94: 'Urns',
    95: 'Wardrobe',
    96: 'Waste',
    97: 'Weapons/Armor racks',
    98: 'Wine cellar',
    99: 'Wooden bathtub',
    100: 'Workbench',
  },
};

// Book: Dungeons > Special rooms, p. 76.
export const tableDungeonSpecialRoom: RandomTable = {
  id: 248,
  title: 'Dungeon Special Room',
  options: {
    1: 'Advanced technology',
    2: 'Animated furniture',
    3: 'Amplified magic room',
    4: 'Ancient memories sphere',
    5: 'Anti-magic room',
    6: 'Armor disintegrating ray',
    7: 'Aviary',
    8: 'Body exchange',
    9: 'Boss monster',
    10: 'Bottomless pit',
    11: 'Ceaseless wailing',
    12: 'Cleaning receptacle',
    13: 'Crying statues',
    14: 'Cursed room',
    15: 'Cursed treasure',
    16: 'Demon trap',
    17: 'Demonic portal',
    18: 'Devouring coin',
    19: 'Divination basin',
    20: 'Divine altar',
    21: 'Dungeon tavern',
    22: 'Duplicating machine',
    23: 'Emergency exit',
    24: 'Ethereal voices',
    25: 'Evil altar',
    26: 'Fake gold items',
    27: 'Fear room',
    28: 'Flesh room',
    29: 'Flood lever',
    30: 'Floor is lava',
    31: 'Food rot room',
    32: 'Freshly walled corridor',
    33: 'Gold statue',
    34: 'Golden apple tree',
    35: 'Greed room',
    36: 'Hallucinogenic spores',
    37: 'Healing lava pool',
    38: 'Heart of the dungeon',
    39: 'High up item',
    40: 'Human outpost',
    41: 'Hungry mouth',
    42: 'Illusory treasure',
    43: 'Interplanar portal',
    44: 'Invisible bridge',
    45: 'Key storage room',
    46: 'Lava pit',
    47: 'Maddening mural',
    48: 'Magic berry bush',
    49: 'Magic forge',
    50: 'Magic fountain',
    51: 'Magic pool',
    52: 'Magic stairs',
    53: 'Medicine cabinet',
    54: 'Merchant in a wall',
    55: 'Minecart',
    56: 'Mirror of opposites',
    57: 'Mirror room',
    58: 'Mislabeled potions',
    59: 'Monster market',
    60: 'Moving statues',
    61: 'Musical slabs',
    62: 'Mutation room',
    63: 'Neutral altar',
    64: 'No way back',
    65: 'Orb of transformation',
    66: 'Parasitized monster',
    67: 'Party room',
    68: 'Peace room',
    69: 'Petrified adventurers',
    70: 'Powerful electromagnet',
    71: 'Rabbit switch',
    72: 'Reverse gravity',
    73: 'Room out of time',
    74: 'Rotating cylinders',
    75: 'Rotating room',
    76: 'Safe',
    77: 'Shrinking pedestal',
    78: 'Shrinking ray',
    79: 'Sleep inducing room',
    80: 'Slot machine',
    81: 'Sphinx',
    82: 'Strange eggs',
    83: 'Structural treasure',
    84: 'Switch in a hole',
    85: 'Talking basin',
    86: 'Talking skull',
    87: 'Talking statue',
    88: 'Tentacles room',
    89: 'Trampoline floor',
    90: 'Translating device',
    91: 'True intentions room',
    92: 'Truth room',
    93: 'Valuable monster (alive)',
    94: 'Valuable monster (part)',
    95: 'Vending machine',
    96: 'Voices of the ancestors',
    97: 'Vortex',
    98: 'Water to wine machine',
    99: 'Wheel of fortune',
    100: 'Wish fountain',
  },
};

// Book: Dungeons > Special rooms > 8) Body exchange, p. 78.
export const tableDungeonBodyExchangeDuration: RandomTable = {
  id: 249,
  title: 'Body Exchange Duration',
  options: {
    1: '3d6 rounds',
    2: '3d6 rounds',
    3: '3d6 rounds',
    4: 'Until needing to act fast, after recovering the body',
    5: 'Until needing to act fast, after recovering the body',
    6: 'Forever (or reroll)',
  },
};

// Book: Dungeons > Special rooms > 8) Body exchange, p. 78.
export const tableDungeonBodyExchangeReappearance: RandomTable = {
  id: 250,
  title: 'Body Exchange Reappearance',
  options: {
    1: '1d6 days',
    2: '1d6 days',
    3: '1d6 days',
    4: '1d6 weeks',
    5: '1d6 weeks',
    6: '1d6 months',
  },
};

// Book: Dungeons > Special rooms > 32) Freshly walled corridor, p. 85.
export const tableDungeonFreshlyWalledCorridor: RandomTable = {
  id: 251,
  title: 'Freshly Walled Corridor',
  options: {
    1: 'Cement is drying',
    2: 'Cement is drying',
    3: 'Cement is drying',
    4: 'Missing a few bricks',
    5: 'Missing a few bricks',
    6: 'Still being built by monsters',
  },
};

// Book: Dungeons > Special rooms > 39) High up item, p. 87.
export const tableDungeonHighUpItem: RandomTable = {
  id: 252,
  title: 'High Up Item',
  options: {
    1: 'Fake gold',
    2: 'Fake gold',
    3: 'Fake gold',
    4: 'Gems',
    5: 'Gems',
    6: 'A potion',
  },
};

// Book: Dungeons > Special rooms > 45) Key storage room, p. 89.
export const tableDungeonKeyCondition: RandomTable = {
  id: 253,
  title: 'Key Condition',
  options: {
    1: 'Broken',
    2: 'Broken',
    3: 'Broken',
    4: 'Cursed',
    5: 'Cursed',
    6: 'Usable',
  },
};

// Book: Dungeons > Special rooms > 49) Magic forge, p. 90.
export const tableDungeonMagicForgeResult: RandomTable = {
  id: 254,
  title: 'Magic Forge Result',
  options: {
    1: 'Failure to craft a weapon',
    2: 'Failure to craft a weapon',
    3: 'Failure to craft a weapon',
    4: '+1 weapon versus a random kind of monster',
    5: '+1 weapon versus a random kind of monster',
    6: '+1 weapon',
  },
};

// Book: Dungeons > Special rooms > 50) Magic fountain, p. 90.
export const tableDungeonMagicFountainSirenIntentions: RandomTable = {
  id: 255,
  title: 'Magic Fountain Siren Intentions',
  options: {
    1: 'Hostile and will attack',
    2: 'Hostile and will attack',
    3: 'Hostile and will attack',
    4: 'Willing to help the characters',
    5: 'Willing to help the characters',
    6: 'Wants help to escape',
  },
};

// Book: Dungeons > Special rooms > 52) Magic stairs, p. 90.
export const tableDungeonMagicStairsDestination: RandomTable = {
  id: 256,
  title: 'Magic Stairs Destination',
  options: {
    1: 'A room at a higher/deeper level',
    2: 'A room at a higher/deeper level',
    3: 'A room at a higher/deeper level',
    4: 'The entrance of the dungeon',
    5: 'The entrance of the dungeon',
    6: 'Another plane',
  },
};

// Book: Dungeons > Special rooms > 53) Medicine cabinet, p. 91.
export const tableDungeonMedicineCabinetTreatment: RandomTable = {
  id: 257,
  title: 'Medicine Cabinet Treatment',
  options: {
    1: 'Take 1d6 damage',
    2: 'Take 1d6 damage',
    3: 'Take 1d6 damage',
    4: 'Lose one sense for 2d3 days',
    5: 'Lose one sense for 2d3 days',
    6: 'Get poisoned',
  },
};

// Book: Dungeons > Special rooms > 55) Minecart, p. 91.
export const tableDungeonMinecartDestination: RandomTable = {
  id: 258,
  title: 'Minecart Destination',
  options: {
    1: 'Same level',
    2: 'Same level',
    3: 'Same level',
    4: 'Different level',
    5: 'Different level',
    6: 'Different area',
  },
};

// Book: Dungeons > Special rooms > 60) Moving statues, p. 93.
export const tableDungeonMovingStatuesBlockedExits: RandomTable = {
  id: 259,
  title: 'Moving Statues Blocked Exits',
  options: {
    1: 'One',
    2: 'One',
    3: 'One',
    4: 'Two',
    5: 'Two',
    6: 'Three',
  },
};

// Book: Dungeons > Special rooms > 62) Mutation room, p. 93.
export const tableDungeonMutation: RandomTable = {
  id: 260,
  title: 'Mutation',
  options: {
    1: 'Burnt skin',
    2: 'Burnt skin',
    3: 'Burnt skin',
    4: 'Extra limb',
    5: 'Extra limb',
    6: 'Poisonous spit',
  },
};

// Book: Dungeons > Special rooms > 65) Orb of transformation, p. 94.
export const tableDungeonOrbTransformation: RandomTable = {
  id: 261,
  title: 'Orb Transformation',
  options: {
    1: 'Goblin',
    2: 'Goblin',
    3: 'Kobold',
    4: 'Kobold',
    5: 'Orc',
    6: 'Chicken',
  },
};

// Book: Dungeons > Special rooms > 69) Petrified adventurers, p. 95.
export const tableDungeonPetrifiedAdventurerCause: RandomTable = {
  id: 262,
  title: 'Petrified Adventurer Cause',
  options: {
    1: 'Wizard',
    2: 'Wizard',
    3: 'Wizard',
    4: 'Medusa',
    5: 'Medusa',
    6: 'Basilisk',
  },
};

// Book: Dungeons > Special rooms > 69) Petrified adventurers, p. 95.
export const tableDungeonPetrifiedAdventurerOutcome: RandomTable = {
  id: 263,
  title: 'Petrified Adventurer Outcome',
  options: {
    1: 'Reward the PCs when they reach the surface (100 gp)',
    2: 'Reward the PCs when they reach the surface (100 gp)',
    3: 'Reward the PCs when they reach the surface (100 gp)',
    4: 'Join them as retainers',
    5: 'Join them as retainers',
    6: 'Go crazy and attack them',
  },
};

// Book: Dungeons > Special rooms > 70) Powerful electromagnet, p. 96.
export const tableDungeonPowerfulElectromagnetSetting: RandomTable = {
  id: 264,
  title: 'Powerful Electromagnet Setting',
  options: {
    1: 'Magnet is disabled',
    2: 'Magnet is disabled',
    3: 'Magnet is disabled',
    4: 'Medium setting attracts small/medium metal items (save vs poison or lose an item)',
    5: 'Medium setting attracts small/medium metal items (save vs poison or lose an item)',
    6: 'High setting lifts metal weapons, armor, and creatures, sticking them to the magnet',
  },
};

// Book: Dungeons > Special rooms > 84) Switch in a hole, p. 100.
export const tableDungeonSwitchInHole: RandomTable = {
  id: 265,
  title: 'Switch in a Hole',
  options: {
    1: 'Loud “DING DONG” alerts wandering monsters',
    2: 'Loud “DING DONG” alerts wandering monsters',
    3: 'Loud “DING DONG” alerts wandering monsters',
    4: 'Loud “DING DONG” alerts wandering monsters',
    5: 'A blade chops anything in the hole (2d6 damage if it is an arm)',
    6: 'A blade chops anything in the hole (2d6 damage if it is an arm)',
  },
};

// Book: Dungeons > Special rooms > 85) Talking basin, p. 100.
export const tableDungeonTalkingBasinAnswer: RandomTable = {
  id: 266,
  title: 'Talking Basin Answer',
  options: {
    1: 'Lie',
    2: 'Lie',
    3: 'Lie',
    4: 'Incomplete truth',
    5: 'Incomplete truth',
    6: 'Truth',
  },
};

// Book: Dungeons > Special rooms > 99) Wheel of fortune, p. 105.
export const tableDungeonWheelOfFortune: RandomTable = {
  id: 267,
  title: 'Wheel of Fortune',
  options: {
    1: 'Monsters appear',
    2: 'Monsters appear',
    3: 'Monsters appear',
    4: 'Monsters appear',
    5: 'Monsters appear',
    6: 'Monsters appear',
    7: 'Monsters appear',
    8: 'Monsters appear',
    9: 'Monsters appear',
    10: 'Monsters appear',
    11: 'Demon appears',
    12: 'Demon appears',
    13: 'Trap',
    14: 'Trap',
    15: 'Small treasure',
    16: 'Small treasure',
    17: 'Big treasure',
    18: 'Big treasure',
    19: 'Dragon appears',
    20: 'Dragon appears',
  },
};

export const dungeonRandomTables: RandomTable[] = [
  tableDungeonAreaNamePrefix,
  tableDungeonAreaNameNoun,
  tableDungeonAreaTheme,
  tableDungeonCrossSectionLinks,
  tableDungeonLinkTarget,
  tableDungeonLinkTargetWithoutSameDepth,
  tableDungeonSublevelLink,
  tableDungeonFactionCount,
  tableDungeonMonsterLevelDepthI,
  tableDungeonMonsterLevelDepthII,
  tableDungeonMonsterLevelDepthIII,
  tableDungeonMonsterLevelDepthIV,
  tableDungeonMonsterLevelDepthV,
  tableDungeonMonsterLevelDepthVI,
  tableDungeonMonsterTypesLevel1,
  tableDungeonMonsterTypesLevel2,
  tableDungeonMonsterTypesLevel3,
  tableDungeonMonsterTypesLevel4,
  tableDungeonMonsterTypesLevel5,
  tableDungeonMonsterTypesLevel6,
  tableDungeonFactionRelationship,
  tableDungeonCorridorLength,
  tableDungeonCorridorFeatures,
  tableDungeonCorridorDoorSide,
  tableDungeonCorridorEnd,
  tableDungeonRoomSize,
  tableDungeonRoomShape,
  tableDungeonRoomType,
  tableDungeonDoorCount,
  tableDungeonRoomDoorPosition,
  tableDungeonDoorDestination,
  tableDungeonDoorType,
  tableDungeonSecretDoorForm,
  tableDungeonCamouflagedDoorAppearance,
  tableDungeonCamouflagedDoorClue,
  tableDungeonVisibleSecretDoorType,
  tableDungeonSecretDoorMechanism,
  tableDungeonMagicDoorType,
  tableDungeonDemonDoorTask,
  tableDungeonTrap,
  tableDungeonEmptyRoom,
  tableDungeonSpecialRoom,
  tableDungeonBodyExchangeDuration,
  tableDungeonBodyExchangeReappearance,
  tableDungeonFreshlyWalledCorridor,
  tableDungeonHighUpItem,
  tableDungeonKeyCondition,
  tableDungeonMagicForgeResult,
  tableDungeonMagicFountainSirenIntentions,
  tableDungeonMagicStairsDestination,
  tableDungeonMedicineCabinetTreatment,
  tableDungeonMinecartDestination,
  tableDungeonMovingStatuesBlockedExits,
  tableDungeonMutation,
  tableDungeonOrbTransformation,
  tableDungeonPetrifiedAdventurerCause,
  tableDungeonPetrifiedAdventurerOutcome,
  tableDungeonPowerfulElectromagnetSetting,
  tableDungeonSwitchInHole,
  tableDungeonTalkingBasinAnswer,
  tableDungeonWheelOfFortune,
];
