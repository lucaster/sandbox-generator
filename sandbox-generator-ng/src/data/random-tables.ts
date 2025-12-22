import { type RandomTable } from '../domain/random-tables';

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

export const tableNextHexFeature: RandomTable = {
  id: 3,
  title: 'Next Hex Feature',
  options: {
    1: 'Landmark',
    2: 'Landmark',
    3: 'Landmark',
    4: 'Settlement',
    5: 'Lair',
    6: 'Dungeon',
  },
};
