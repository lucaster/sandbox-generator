import { calcNextHexTerrain, tableNextHexTerrain, tableStartingHexTerrain } from './data';

describe('data.ts', () => {
  it('exports tableStartingHexTerrain and tableNextHexTerrain with 10 options each and expected entries', () => {
    expect(tableStartingHexTerrain.id).toBe(0);
    expect(tableStartingHexTerrain.title).toBe('Starting Hex Terrain');
    expect(Object.keys(tableStartingHexTerrain.options).length).toBe(10);
    expect(tableStartingHexTerrain.options[1]).toBe('Grassland');
    expect(tableStartingHexTerrain.options[10]).toBe('Mountains');

    expect(tableNextHexTerrain.id).toBe(1);
    expect(tableNextHexTerrain.title).toBe('Next Hex Terrain');
    expect(Object.keys(tableNextHexTerrain.options).length).toBe(10);
    expect(tableNextHexTerrain.options[6]).toBe('Grassland');
    expect(tableNextHexTerrain.options[10]).toBe('Mountains');
  });

  it('calcNextHex returns previousHex when roll <= 5', () => {
    const previous = 'CustomTerrain';
    const result = calcNextHexTerrain(previous, () => 3);
    expect(result).toBe(previous);
  });

  it('calcNextHex returns mapped tableNextHexTerrain option when roll > 5', () => {
    const previous = 'Whatever';
    const result = calcNextHexTerrain(previous, () => 7);
    expect(result).toBe(tableNextHexTerrain.options[7] as string);
    expect(result).toBe('Forest');
  });

  it('calcNextHex handles boundary values (6 and 10)', () => {
    expect(calcNextHexTerrain('X', () => 6)).toBe('Grassland');
    expect(calcNextHexTerrain('X', () => 10)).toBe('Mountains');
  });
});
