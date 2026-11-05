import { randomOption } from './data';
import { biomeEncountersMarsh } from './lairs';

describe('lairs.ts biome encounter tables', () => {
  it('should never return undefined for a legal roll', () => {
    const result = randomOption(biomeEncountersMarsh.options, () => 1);

    // Fails today: the table starts at key 2, but the roller can produce 1.
    expect(result).toBeDefined();
  });

  it('should be able to produce the last entry (Hydras)', () => {
    const result = randomOption(biomeEncountersMarsh.options, (faces) => faces);

    // Fails today: the roller asks for d11 (faces = 11), so it returns
    // Snake-men and never reaches key 12.
    expect(result).toBe('Hydras');
  });

  it('should reach the highest key of a table keyed 2..12', () => {
    const keys = Object.keys(biomeEncountersMarsh.options).map(Number);
    expect(Math.min(...keys)).toBe(2);
    expect(Math.max(...keys)).toBe(12);

    let requestedFaces = 0;
    randomOption(biomeEncountersMarsh.options, (faces) => {
      requestedFaces = faces;
      return faces;
    });

    // Fails today: the roller uses the number of entries (11) as the die size.
    expect(requestedFaces).toBe(12);
  });
});
