import { calcNextHex, tableNextHex as nextHex, tableStartingHex as startingHex } from './data';

describe('data.ts', () => {
  it('exports startingHex and nextHex with 10 options each and expected entries', () => {
    expect(startingHex.id).toBe(0);
    expect(startingHex.title).toBe('Starting Hex Terrain');
    expect(Object.keys(startingHex.options).length).toBe(10);
    expect(startingHex.options[1]).toBe('Grassland');
    expect(startingHex.options[10]).toBe('Mountains');

    expect(nextHex.id).toBe(1);
    expect(nextHex.title).toBe('Next Hex Terrain');
    expect(Object.keys(nextHex.options).length).toBe(10);
    expect(nextHex.options[6]).toBe('Grassland');
    expect(nextHex.options[10]).toBe('Mountains');
  });

  it('calcNextHex returns previousHex when roll <= 5', () => {
    const previous = 'CustomTerrain';
    const result = calcNextHex(previous, () => 3);
    expect(result).toBe(previous);
  });

  it('calcNextHex returns mapped nextHex option when roll > 5', () => {
    const previous = 'Whatever';
    const result = calcNextHex(previous, () => 7);
    expect(result).toBe(nextHex.options[7] as string);
    expect(result).toBe('Forest');
  });

  it('calcNextHex handles boundary values (6 and 10)', () => {
    expect(calcNextHex('X', () => 6)).toBe('Grassland');
    expect(calcNextHex('X', () => 10)).toBe('Mountains');
  });
});
