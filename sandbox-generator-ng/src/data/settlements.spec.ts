import { calcHamlet, tableHamletDisposition } from './settlements';

describe('settlements.ts tableHamletDisposition', () => {
  it('uses 2d6 and the 2023 edition result groups', () => {
    expect(tableHamletDisposition.dice).toBe('2d6');
    expect(Object.keys(tableHamletDisposition.options).map(Number)).toEqual([
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
    expect(tableHamletDisposition.options[1]).toBeUndefined();

    expect(tableHamletDisposition.options[2]).toBe('Attack on sight');
    expect(tableHamletDisposition.options[3]).toBe('Hostile');
    expect(tableHamletDisposition.options[5]).toBe('Hostile');
    expect(tableHamletDisposition.options[6]).toBe('Neutral');
    expect(tableHamletDisposition.options[8]).toBe('Neutral');
    expect(tableHamletDisposition.options[9]).toBe('Welcoming');
    expect(tableHamletDisposition.options[11]).toBe('Welcoming');
    expect(tableHamletDisposition.options[12]).toBe('Enthusiastic');
  });
});

describe('settlements.ts calcHamlet secret', () => {
  it('generates a secret when the 1d6 check returns 1', () => {
    const hamlet = calcHamlet(() => 1);

    expect(hamlet.secret).not.toBeNull();
    expect(hamlet.secret?.result).toBe('Cannibals');
  });

  it('does not generate a secret when the 1d6 check returns 2-6', () => {
    const hamlet = calcHamlet(() => 2);

    expect(hamlet.secret).toBeNull();
  });
});
