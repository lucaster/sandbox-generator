import { calcHamlet, calcVillage, tableHamletDisposition } from './settlements';

function sequence(values: number[], fallback = 1) {
  let index = 0;
  return (faces: number) => Math.min(values[index++] ?? fallback, faces);
}

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

describe('settlements.ts calcVillage', () => {
  it('generates general locations, guards, and unique defenses', () => {
    const village = calcVillage(
      sequence([1, 2, 1, 1, 2, 1, 4, 1, 1, 1, 1, 2, 1, 2, 2, 2])
    );

    expect(village.generalLocations).toEqual(['Blacksmith', 'Market', 'Tavern', 'Well']);
    expect(village.guards).toBe(8);
    expect(village.defenses.map((defense) => defense.result)).toEqual([
      'Wooden palisade',
      'Motte (= mound)',
    ]);
    expect(village.disposition.villageDisposition.result).toBe('Attack on sight');
    expect(village.disposition.rulerDisposition.result).toBe('Attack on sight');
    expect(village.secret).toBeNull();
    expect(village.event.hasEvent).toBe(false);
  });

  it('rerolls duplicate defenses', () => {
    const village = calcVillage(
      sequence([1, 2, 1, 1, 2, 1, 1, 4, 1, 1, 1, 1, 1, 2, 1, 2, 2])
    );

    expect(village.defenses.map((defense) => defense.result)).toEqual([
      'Wooden palisade',
      'Motte (= mound)',
    ]);
  });

  it('rolls 2d6 for the village and 1d6 for a neutral ruler', () => {
    const hostile = calcVillage(
      sequence([1, 2, 1, 1, 2, 1, 4, 1, 3, 3, 1, 1, 2, 1, 2, 2])
    );
    expect(hostile.disposition.villageDisposition.result).toBe('Neutral');
    expect(hostile.disposition.rulerDisposition.result).toBe('Hostile');

    const welcoming = calcVillage(
      sequence([1, 2, 1, 1, 2, 1, 4, 1, 3, 3, 4, 1, 2, 1, 2, 2])
    );
    expect(welcoming.disposition.villageDisposition.result).toBe('Neutral');
    expect(welcoming.disposition.rulerDisposition.result).toBe('Welcoming');
  });

  it('uses the opposite disposition for the ruler', () => {
    const village = calcVillage(
      sequence([1, 2, 1, 1, 2, 1, 4, 1, 1, 1, 5, 1, 2, 1, 2, 2])
    );

    expect(village.disposition.villageDisposition.result).toBe('Attack on sight');
    expect(village.disposition.rulerDisposition.result).toBe('Enthusiastic');
  });
});
