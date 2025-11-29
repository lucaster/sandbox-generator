import { calcNextHexBiome, tableNextHexBiome, tableStartingHexBiome } from './data';

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
});
