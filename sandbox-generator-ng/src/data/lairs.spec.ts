import { randomOption } from './data';
import { biomeEncountersMarsh } from './lairs';

describe('lairs.ts biome encounter tables', () => {
  it('should never return undefined for a legal roll', () => {
    const result = randomOption(biomeEncountersMarsh, () => 1);

    // Tables keyed 2..12 have no key 1; the roller clamps into range.
    expect(result).toBeDefined();
  });

  it('should be able to produce the last entry (Hydras)', () => {
    const result = randomOption(biomeEncountersMarsh, (faces) => faces);

    // Both d6s return their maximum, so the result is key 12.
    expect(result).toBe('Hydras');
  });

  it('should roll 2d6 for a table keyed 2..12', () => {
    const keys = Object.keys(biomeEncountersMarsh.options).map(Number);
    expect(Math.min(...keys)).toBe(2);
    expect(Math.max(...keys)).toBe(12);

    const requestedFaces: number[] = [];
    randomOption(biomeEncountersMarsh, (faces) => {
      requestedFaces.push(faces);
      return faces;
    });

    expect(requestedFaces).toEqual([6, 6]);
  });
});
