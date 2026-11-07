import { randomOption } from './data';
import {
  biomeEncountersMarsh,
  calcLair,
  lairLayout,
  lairLayoutPercentages,
} from './lairs';

function sequence(values: number[], fallback = 1) {
  let index = 0;
  return (faces: number) => Math.min(values[index++] ?? fallback, faces);
}

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

describe('lairs.ts lairLayout table', () => {
  it('matches the 2023 edition', () => {
    expect(lairLayout.options).toEqual({
      1: '1',
      2: '2',
      3: '2',
      4: '3',
      5: '3',
      6: '4',
      7: '4',
      8: '5',
    });
  });
});

describe('lairs.ts lair layout percentages', () => {
  it('uses the room proportions read from the 2023 diagrams', () => {
    expect(lairLayoutPercentages[1]).toEqual([100]);
    expect(lairLayoutPercentages[2]).toEqual([75, 25]);
    expect(lairLayoutPercentages[3]).toEqual([40, 30, 30]);
    expect(lairLayoutPercentages[4]).toEqual([10, 20, 20, 50]);
    expect(lairLayoutPercentages[5]).toEqual([40, 20, 15, 10, 15]);
  });
});

describe('lairs.ts calcLair', () => {
  it('reproduces the book example (200 goblins, 4000 sp, 4 gems, 40% outside)', () => {
    // Forest 2d6 = 3 + 3 -> Goblins (key 6).
    // % in lair = 50, roll 70 -> patrol.
    // Outside 1d6 = 4 -> 40%.
    // Outside hex 1d8 = 8 -> split; each group rolls 1d8 -> 3 and 5.
    // Layout 1d8 = 6 -> layout 4 (the example says "4", but the table maps
    // 4-5 to layout 3; the four-room result is layout 4).
    const lair = calcLair(
      'Forest',
      {
        totalMonsters: 200,
        treasure: { sp: 4000, gems: 4 },
        percentInLair: 50,
      },
      sequence([3, 3, 70, 4, 8, 3, 5, 6])
    );

    expect(lair.inhabitants).toBe('Goblins');
    expect(lair.encounter).toBe('patrol');
    expect(lair.percOutsideLair).toBe(40);
    expect(lair.percInsideLair).toBe(60);
    expect(lair.outsideHexes).toEqual([3, 5]);
    expect(lair.layout).toBe(4);
    expect(lair.totalMonsters).toBe(200);
    expect(lair.outsideMonsters).toBe(80);
    expect(lair.insideMonsters).toBe(120);
    expect(lair.rooms).toEqual([
      { number: 1, percentage: 10, monsters: 12, treasure: { sp: 400, gems: 0 } },
      { number: 2, percentage: 20, monsters: 24, treasure: { sp: 800, gems: 1 } },
      { number: 3, percentage: 20, monsters: 24, treasure: { sp: 800, gems: 1 } },
      { number: 4, percentage: 50, monsters: 60, treasure: { sp: 2000, gems: 2 } },
    ]);
  });

  it('maps each 1d8 result to the book layout', () => {
    const expected: { [roll: number]: number } = {
      1: 1,
      2: 2,
      3: 2,
      4: 3,
      5: 3,
      6: 4,
      7: 4,
      8: 5,
    };

    for (const [roll, layout] of Object.entries(expected)) {
      const lair = calcLair(
        'Forest',
        { rollOutside: false },
        sequence([3, 3, Number(roll)])
      );
      expect(lair.layout).toBe(layout);
    }
  });

  it('rolls 1d3 for small groups or lone monsters', () => {
    const requestedFaces: number[] = [];
    const lair = calcLair('Forest', { smallGroups: true, rollOutside: false }, (faces) => {
      requestedFaces.push(faces);
      return faces;
    });

    expect(requestedFaces).toEqual([6, 6, 3]);
    expect(lair.layout).toBe(3);
    expect(lair.percentages).toEqual([40, 30, 30]);
  });

  it('rolls 1d8 for each outside group and allows duplicate hexes', () => {
    const lair = calcLair(
      'Forest',
      {},
      sequence([3, 3, 4, 8, 3, 3, 6])
    );

    expect(lair.outsideHexes).toEqual([3, 3]);
  });

  it('encounters the lair when the roll is within the % in lair', () => {
    const lair = calcLair(
      'Forest',
      { percentInLair: 50, rollOutside: false },
      sequence([3, 3, 50])
    );

    expect(lair.encounter).toBe('lair');
  });

  it('encounters a patrol when the roll is above the % in lair', () => {
    const lair = calcLair(
      'Forest',
      { percentInLair: 50, rollOutside: false },
      sequence([3, 3, 51])
    );

    expect(lair.encounter).toBe('patrol');
  });

  it('does not roll % in lair or the outside proportion when they are not requested', () => {
    const requestedFaces: number[] = [];
    calcLair('Forest', { rollOutside: false }, (faces) => {
      requestedFaces.push(faces);
      return faces;
    });

    // Inhabitants 2d6, then the layout 1d8 only.
    expect(requestedFaces).toEqual([6, 6, 8]);
  });

  it('can skip the optional outside proportion', () => {
    const lair = calcLair(
      'Forest',
      { totalMonsters: 200, rollOutside: false },
      sequence([3, 3, 1])
    );

    expect(lair.percOutsideLair).toBe(0);
    expect(lair.percInsideLair).toBe(100);
    expect(lair.outsideHexes).toEqual([]);
    expect(lair.outsideMonsters).toBe(0);
    expect(lair.insideMonsters).toBe(200);
    expect(lair.rooms.reduce((sum, room) => sum + (room.monsters ?? 0), 0)).toBe(200);
  });

  it('leaves monsters and treasure null when the bestiary values are not provided', () => {
    const lair = calcLair(
      'Forest',
      { rollOutside: false },
      sequence([3, 3, 1])
    );

    expect(lair.totalMonsters).toBeNull();
    expect(lair.treasure).toBeNull();
    expect(lair.rooms).toEqual([
      { number: 1, percentage: 100, monsters: null, treasure: null },
    ]);
  });

  it('keeps the total when the monster distribution does not divide evenly', () => {
    const lair = calcLair(
      'Forest',
      { totalMonsters: 101, rollOutside: false },
      sequence([3, 3, 6])
    );

    expect(lair.layout).toBe(4);
    expect(lair.rooms.reduce((sum, room) => sum + (room.monsters ?? 0), 0)).toBe(101);
  });
});
