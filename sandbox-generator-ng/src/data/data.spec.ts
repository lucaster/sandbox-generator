import {
  calcHexesBiome,
  calcHexesDetailedFeature,
  calcHexesFeature,
  calcNextHexBiome,
  oppositeOptionEntry,
} from './data';
import { tableNextHexBiome, tableStartingHexBiome } from './biome-tables';

describe('data.ts', () => {
  it('exports tableStartingHexBiome and tableNextHexBiome with 10 options each and expected entries', () => {
    expect(tableStartingHexBiome.id).toBe(0);
    expect(tableStartingHexBiome.title).toBe('Starting Hex Biome');
    expect(Object.keys(tableStartingHexBiome.options).length).toBe(10);
    expect(tableStartingHexBiome.options[1]).toBe('Grassland');
    expect(tableStartingHexBiome.options[10]).toBe('Mountains');

    expect(tableNextHexBiome.id).toBe(2);
    expect(tableNextHexBiome.title).toBe('Next Hex Biome');
    expect(Object.keys(tableNextHexBiome.options).length).toBe(10);
    expect(tableNextHexBiome.options[6]).toBe('Grassland');
    expect(tableNextHexBiome.options[10]).toBe('Mountains');
  });

  it('calcNextHex returns previousHex when roll <= 5', () => {
    const previous = 'CustomBiome';
    const result = calcNextHexBiome(previous, () => 3);
    expect(result).toBe(previous);
  });

  it('calcNextHex returns mapped tableNextHexBiome option when roll > 5', () => {
    const previous = 'Whatever';
    const result = calcNextHexBiome(previous, () => 7);
    expect(result).toBe(tableNextHexBiome.options[7] as string);
    expect(result).toBe('Forest');
  });

  it('calcNextHex handles boundary values (6 and 10)', () => {
    expect(calcNextHexBiome('X', () => 6)).toBe('Grassland');
    expect(calcNextHexBiome('X', () => 10)).toBe('Mountains');
  });

  it('calcHexesBiome forwards rollFn to the starting-hex roll', () => {
    const hexes = calcHexesBiome(() => 9);

    expect(hexes[1]).toBe('Marsh');
  });

  it('calcHexesFeature fixes the first hex to Village and the second to Dungeon', () => {
    const hexes = calcHexesFeature(() => 6);

    expect(hexes[1]).toBe('Village');
    expect(hexes[2]).toBe('Dungeon');
  });

  it('calcHexesDetailedFeature fixes the first two hexes', () => {
    const hexes = calcHexesDetailedFeature(() => 1);

    expect(hexes[1]).toEqual(['Village']);
    expect(hexes[2]).toEqual(['Dungeon']);
  });

  it('oppositeOptionEntry mirrors the actual keys', () => {
    const table = {
      id: 0,
      title: 'Test',
      options: { 2: 'A', 3: 'B', 4: 'C' },
    };

    expect(oppositeOptionEntry(2, table)).toEqual({ roll: 4, result: 'C' });
    expect(oppositeOptionEntry(3, table)).toEqual({ roll: 3, result: 'B' });
    expect(oppositeOptionEntry(4, table)).toEqual({ roll: 2, result: 'A' });
  });
});
