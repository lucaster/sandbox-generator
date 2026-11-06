import {
  calcContent,
  calcContentWithPath,
  calcHexesDetailedContentWithDetails,
} from './content';
import {
  tableContentConvey,
  tableContentTreasureChance,
} from './random-tables';

function sequence(values: number[], fallback = 1) {
  let index = 0;
  return (faces: number) => Math.min(values[index++] ?? fallback, faces);
}

function seeded(seed: number) {
  return (faces: number) => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return (seed % faces) + 1;
  };
}

describe('random-tables.ts content tables', () => {
  it('uses the 2023 treasure chances', () => {
    expect(tableContentTreasureChance.options['Hazard']).toBe(0.25);
    expect(tableContentTreasureChance.options['Empty']).toBe(0.15);
    expect(tableContentTreasureChance.options['Special']).toBeNull();
    expect(tableContentTreasureChance.options['Monsters']).toBe(0.5);
  });

  it('lists the six ways information can be conveyed', () => {
    expect(tableContentConvey.options[1]).toBe('Clues left by monsters');
    expect(tableContentConvey.options[2]).toBe(
      'Depicted on an old fresco/mosaic'
    );
    expect(tableContentConvey.options[4]).toBe('Told by a (dying) NPC');
    expect(tableContentConvey.options[6]).toBe(
      'Written in a book or on a scroll'
    );
  });
});

describe('content.ts calcContentWithPath', () => {
  it('returns the table path alongside the content result', () => {
    const content = calcContentWithPath(sequence([4, 10, 4, 3]));

    expect(content.path).toEqual([
      'Special',
      'Related to landmark',
      'Uncover a mystery',
      'Curse',
    ]);
    expect(content.type).toBe('Special');
    expect(content.detail).toBe(
      'Related to landmark: Uncover a mystery: Curse'
    );
  });

  it('returns a single-element path for monsters', () => {
    const content = calcContentWithPath(sequence([5, 11]));

    expect(content.path).toEqual(['Monsters']);
    expect(content.detail).toBeNull();
  });
});

describe('content.ts calcHexesDetailedContentWithDetails', () => {
  it('returns one content result per hex, matching the drawn path', () => {
    const { hexesDetailed, contents } = calcHexesDetailedContentWithDetails(
      sequence([], 1)
    );

    expect(Object.keys(hexesDetailed).length).toBe(19);
    expect(Object.keys(hexesDetailed)).toEqual(Object.keys(contents));
    expect(hexesDetailed[1]).toEqual(['Hazard', 'Acid pits']);
    expect(contents[1]).toEqual({
      path: ['Hazard', 'Acid pits'],
      type: 'Hazard',
      detail: 'Acid pits',
      treasure: { chance: 0.25, roll: 1, hasTreasure: true },
      convey: null,
    });
  });

  it('keeps the treasure and convey rolls for each hex', () => {
    const { contents } = calcHexesDetailedContentWithDetails(
      sequence([2, 19, 52, 3])
    );

    expect(contents[1].type).toBe('Empty');
    expect(contents[1].treasure.hasTreasure).toBe(false);
    expect(contents[1].convey?.result).toBe('Etched/Drawn on something');
  });
});

describe('content.ts calcContent', () => {
  it('generates a hazard and checks its 25% treasure chance', () => {
    expect(calcContent(sequence([1, 12, 69]))).toEqual({
      type: 'Hazard',
      detail: 'Hunting traps',
      treasure: { chance: 0.25, roll: 69, hasTreasure: false },
      convey: null,
    });
  });

  it('finds treasure on a hazard when the 1d100 roll is within 25', () => {
    expect(calcContent(sequence([1, 1, 25])).treasure.hasTreasure).toBe(true);
  });

  it('generates an empty hex with learnable info and how it is conveyed', () => {
    expect(calcContent(sequence([2, 19, 52, 3]))).toEqual({
      type: 'Empty',
      detail: 'Upcoming weather',
      treasure: { chance: 0.15, roll: 52, hasTreasure: false },
      convey: { key: 3, result: 'Etched/Drawn on something' },
    });
  });

  it('finds treasure on an empty hex when the 1d100 roll is within 15', () => {
    const content = calcContent(sequence([3, 9, 15, 6]));

    expect(content.detail).toBe('Dungeon location');
    expect(content.treasure.hasTreasure).toBe(true);
    expect(content.convey?.result).toBe(
      'Written in a book or on a scroll'
    );
  });

  it('does not roll for treasure on special content', () => {
    expect(calcContent(sequence([4, 8, 3]))).toEqual({
      type: 'Special',
      detail: 'NPC(s)/Monster(s) in need: Disappearance',
      treasure: { chance: null, roll: null, hasTreasure: null },
      convey: null,
    });
  });

  it('resolves a special related to the landmark', () => {
    expect(calcContent(sequence([4, 10, 4, 3]))).toEqual({
      type: 'Special',
      detail: 'Related to landmark: Uncover a mystery: Curse',
      treasure: { chance: null, roll: null, hasTreasure: null },
      convey: null,
    });
  });

  it('generates monsters and checks their 50% treasure chance', () => {
    expect(calcContent(sequence([5, 11]))).toEqual({
      type: 'Monsters',
      detail: null,
      treasure: { chance: 0.5, roll: 11, hasTreasure: true },
      convey: null,
    });
  });

  it('can find no treasure with monsters', () => {
    const content = calcContent(sequence([6, 90]));

    expect(content.type).toBe('Monsters');
    expect(content.treasure.hasTreasure).toBe(false);
  });

  it('always produces a plausible content result', () => {
    const content = calcContent(seeded(7));

    expect(['Hazard', 'Empty', 'Special', 'Monsters']).toContain(content.type);
    if (content.type === 'Monsters') {
      expect(content.detail).toBeNull();
    } else {
      expect(content.detail).not.toBeNull();
    }
    if (content.type === 'Special') {
      expect(content.treasure).toEqual({
        chance: null,
        roll: null,
        hasTreasure: null,
      });
    } else {
      expect(content.treasure.roll).not.toBeNull();
      expect(typeof content.treasure.hasTreasure).toBe('boolean');
    }
    if (content.type === 'Empty') {
      expect(content.convey).not.toBeNull();
    } else {
      expect(content.convey).toBeNull();
    }
  });
});
