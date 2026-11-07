import { type HexesDetailed } from './data';
import {
  calcFactionEvent,
  calcFactionRelationship,
  calcFactions,
  isIntelligentLair,
  tableFactionEventNature,
  tableFactionEventWhen,
  tableFactionRelationship,
} from './factions';
import { neighborsOfPatchHex, patchHexCoordinates } from './hex-grid';

function sequence(values: number[], fallback = 1) {
  let index = 0;
  return (faces: number) => Math.min(values[index++] ?? fallback, faces);
}

function features(overrides: { [hex: number]: string | string[] }): HexesDetailed {
  const result: HexesDetailed = {};
  for (let hex = 1; hex <= 19; hex++) {
    const value = overrides[hex] ?? 'Landmark';
    result[hex] = Array.isArray(value) ? value : [value];
  }
  return result;
}

describe('factions.ts tables', () => {
  it('uses the 2023 relationship table', () => {
    expect(tableFactionRelationship.dice).toBe('2d6');
    expect(Object.keys(tableFactionRelationship.options).map(Number)).toEqual([
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
    expect(tableFactionRelationship.options[2]).toBe('Open war');
    expect(tableFactionRelationship.options[3]).toBe('Hostility');
    expect(tableFactionRelationship.options[5]).toBe('Hostility');
    expect(tableFactionRelationship.options[6]).toBe('Indifference');
    expect(tableFactionRelationship.options[8]).toBe('Indifference');
    expect(tableFactionRelationship.options[9]).toBe('Peace/Trade');
    expect(tableFactionRelationship.options[11]).toBe('Peace/Trade');
    expect(tableFactionRelationship.options[12]).toBe('Alliance');
  });

  it('uses the 2023 event timing table', () => {
    expect(tableFactionEventWhen.dice).toBe('1d6');
    expect(Object.keys(tableFactionEventWhen.options).map(Number)).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
    expect(tableFactionEventWhen.options[1]).toBe('Ended earlier');
    expect(tableFactionEventWhen.options[2]).toBe('Is happening now');
    expect(tableFactionEventWhen.options[4]).toBe('Is happening now');
    expect(tableFactionEventWhen.options[5]).toBe('Will take place in the future');
    expect(tableFactionEventWhen.options[6]).toBe('Will take place in the future');
  });

  it('uses the 2023 event nature table', () => {
    expect(tableFactionEventNature.dice).toBe('1d12');
    expect(Object.keys(tableFactionEventNature.options).map(Number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
    expect(tableFactionEventNature.options[1]).toBe('Assassination');
    expect(tableFactionEventNature.options[2]).toBe('Celebration');
    expect(tableFactionEventNature.options[3]).toBe('Curse');
    expect(tableFactionEventNature.options[4]).toBe('Holy quest');
    expect(tableFactionEventNature.options[5]).toBe('Hostage situation');
    expect(tableFactionEventNature.options[6]).toBe('Mysterious ally');
    expect(tableFactionEventNature.options[7]).toBe('Negotiations with another faction');
    expect(tableFactionEventNature.options[8]).toBe('New headquarters');
    expect(tableFactionEventNature.options[9]).toBe('New leader');
    expect(tableFactionEventNature.options[10]).toBe('Plague');
    expect(tableFactionEventNature.options[11]).toBe('Treaty signed with another faction');
    expect(tableFactionEventNature.options[12]).toBe('War');
  });
});

describe('factions.ts isIntelligentLair', () => {
  it('accepts intelligent inhabitants from the biome tables', () => {
    expect(isIntelligentLair('Orcs')).toBeTrue();
    expect(isIntelligentLair('Goblins')).toBeTrue();
    expect(isIntelligentLair('Vampires')).toBeTrue();
    expect(isIntelligentLair('Manticores')).toBeTrue();
    expect(isIntelligentLair('Bandits')).toBeTrue();
    expect(isIntelligentLair('Beastmen')).toBeTrue();
    expect(isIntelligentLair('  orcs ')).toBeTrue();
  });

  it('rejects ordinary animals and mindless monsters', () => {
    expect(isIntelligentLair('Wolves')).toBeFalse();
    expect(isIntelligentLair('Giant rats')).toBeFalse();
    expect(isIntelligentLair('Dinosaurs')).toBeFalse();
    expect(isIntelligentLair('Skeletons')).toBeFalse();
    expect(isIntelligentLair('Crocodiles')).toBeFalse();
  });
});

describe('factions.ts calcFactionRelationship', () => {
  it('maps 2d6 to the 2023 relationship groups', () => {
    expect(calcFactionRelationship(sequence([1, 1]))).toEqual({
      roll: 2,
      relation: 'Open war',
    });
    expect(calcFactionRelationship(sequence([1, 2]))).toEqual({
      roll: 3,
      relation: 'Hostility',
    });
    expect(calcFactionRelationship(sequence([3, 3]))).toEqual({
      roll: 6,
      relation: 'Indifference',
    });
    expect(calcFactionRelationship(sequence([5, 5]))).toEqual({
      roll: 10,
      relation: 'Peace/Trade',
    });
    expect(calcFactionRelationship(sequence([6, 6]))).toEqual({
      roll: 12,
      relation: 'Alliance',
    });
  });
});

describe('factions.ts calcFactionEvent', () => {
  it('returns no event when the 1d6 check is not 1', () => {
    expect(calcFactionEvent(sequence([2]))).toBeNull();
    expect(calcFactionEvent(sequence([6]))).toBeNull();
  });

  it('returns the timing and nature when the 1d6 check is 1', () => {
    expect(calcFactionEvent(sequence([1, 1, 1]))).toEqual({
      when: 'Ended earlier',
      nature: 'Assassination',
    });
    expect(calcFactionEvent(sequence([1, 3, 7]))).toEqual({
      when: 'Is happening now',
      nature: 'Negotiations with another faction',
    });
    expect(calcFactionEvent(sequence([1, 6, 12]))).toEqual({
      when: 'Will take place in the future',
      nature: 'War',
    });
  });
});

describe('hex-grid.ts patch adjacency', () => {
  it('knows the centre and first-ring neighbours', () => {
    expect(neighborsOfPatchHex(1)).toEqual([2, 3, 4, 5, 6, 7]);
    expect(neighborsOfPatchHex(2)).toEqual([1, 3, 7, 8, 9, 19]);
  });

  it('is symmetric, has no self-links, and stays inside the patch', () => {
    for (let hex = 1; hex <= 19; hex++) {
      expect(patchHexCoordinates[hex]).toBeDefined();
      for (const neighbor of neighborsOfPatchHex(hex)) {
        expect(neighbor).not.toBe(hex);
        expect(neighbor).toBeGreaterThanOrEqual(1);
        expect(neighbor).toBeLessThanOrEqual(19);
        expect(neighborsOfPatchHex(neighbor)).toContain(hex);
      }
    }
  });
});

describe('factions.ts calcFactions domains', () => {
  it('creates a seven-hex domain for a castle', () => {
    const result = calcFactions(features({ 1: 'Castle' }), {}, () => 2);

    expect(result.factions.length).toBe(1);
    expect(result.factions[0].number).toBe(1);
    expect(result.factions[0].type).toBe('castle');
    expect(result.factions[0].label).toBe('Castle 1');
    expect(result.factions[0].sources).toEqual([{ hex: 1, type: 'castle' }]);
    expect(result.factions[0].hexes).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(result.factions[0].relationships).toEqual([]);
    expect(result.factions[0].event).toBeNull();
    expect(result.hexFactions[1]).toEqual([1]);
    expect(result.hexFactions[8]).toEqual([]);
    expect(result.contestedHexes).toEqual([]);
  });

  it('creates a seven-hex domain for a city and reads nested feature paths', () => {
    const result = calcFactions(features({ 1: ['Settlement', 'City'] }), {}, () => 2);

    expect(result.factions.length).toBe(1);
    expect(result.factions[0].type).toBe('city');
    expect(result.factions[0].label).toBe('City 1');
    expect(result.factions[0].hexes).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('does not create factions for hamlets, villages, dungeons, or landmarks', () => {
    const result = calcFactions(
      features({ 1: 'Hamlet', 2: 'Village', 3: 'Dungeon', 4: 'Landmark' }),
      {},
      () => 1
    );

    expect(result.factions).toEqual([]);
    expect(Object.keys(result.hexFactions).length).toBe(19);
    expect(result.hexFactions[1]).toEqual([]);
    expect(result.hexFactions[2]).toEqual([]);
    expect(result.contestedHexes).toEqual([]);
  });

  it('marks shared hexes as contested when two big domains stay separate', () => {
    const result = calcFactions(features({ 1: 'Castle', 3: 'City' }), {}, () => 4);

    expect(result.factions.length).toBe(2);
    expect(result.factions[0].hexes).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(result.factions[1].hexes).toEqual([1, 2, 3, 4, 9, 10, 11]);
    expect(result.contestedHexes).toEqual([1, 2, 3, 4]);
    expect(result.hexFactions[1]).toEqual([1, 2]);
    expect(result.factions[0].relationships).toEqual([
      { faction: 2, roll: 8, relation: 'Indifference' },
    ]);
    expect(result.factions[1].relationships).toEqual([
      { faction: 1, roll: 8, relation: 'Indifference' },
    ]);
  });

  it('merges two big domains on a 3-in-6 roll', () => {
    const result = calcFactions(features({ 1: 'Castle', 3: 'City' }), {}, () => 3);

    expect(result.factions.length).toBe(1);
    expect(result.factions[0].type).toBe('mixed');
    expect(result.factions[0].sources).toEqual([
      { hex: 1, type: 'castle' },
      { hex: 3, type: 'city' },
    ]);
    expect(result.factions[0].label).toBe('Castle 1 + City 3');
    expect(result.factions[0].hexes).toEqual([1, 2, 3, 4, 5, 6, 7, 9, 10, 11]);
    expect(result.factions[0].relationships).toEqual([]);
    expect(result.factions[0].event).toBeNull();
    expect(result.contestedHexes).toEqual([]);
  });

  it('merges a chain of overlapping big domains transitively', () => {
    const result = calcFactions(
      features({ 1: 'Castle', 3: 'City', 12: 'Castle' }),
      {},
      sequence([1, 1], 2)
    );

    expect(result.factions.length).toBe(1);
    expect(result.factions[0].sources).toEqual([
      { hex: 1, type: 'castle' },
      { hex: 3, type: 'city' },
      { hex: 12, type: 'castle' },
    ]);
    expect(result.factions[0].label).toBe('Castle 1 + City 3 + Castle 12');
    expect(result.factions[0].hexes).toEqual([1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13]);
  });
});

describe('factions.ts small settlement extensions', () => {
  it('adds only magically enslaved neighbours to a tower domain', () => {
    const result = calcFactions(
      features({
        1: 'Tower',
        2: 'Hamlet',
        3: 'Village',
        4: 'Lair',
        5: 'Dungeon',
        6: 'Hamlet',
        7: 'Hamlet',
      }),
      { lairInhabitants: { 4: 'Wolves' } },
      sequence([1, 2, 1, 2, 1, 2], 2)
    );

    expect(result.factions.length).toBe(1);
    expect(result.factions[0].label).toBe('Tower 1');
    expect(result.factions[0].hexes).toEqual([1, 2, 4, 6]);
    expect(result.hexFactions[2]).toEqual([1]);
    expect(result.hexFactions[3]).toEqual([]);
    expect(result.hexFactions[5]).toEqual([]);
    expect(result.hexFactions[7]).toEqual([]);
  });

  it('makes an enslaved intelligent lair contested with its own faction', () => {
    const result = calcFactions(
      features({ 1: 'Tower', 2: 'Lair' }),
      { lairInhabitants: { 2: 'Orcs' } },
      sequence([1], 2)
    );

    expect(result.factions.length).toBe(2);
    expect(result.factions[0].label).toBe('Tower 1');
    expect(result.factions[0].hexes).toEqual([1, 2]);
    expect(result.factions[1].label).toBe('Orcs lair 2');
    expect(result.factions[1].hexes).toEqual([2]);
    expect(result.contestedHexes).toEqual([2]);
    expect(result.hexFactions[2]).toEqual([1, 2]);
    expect(result.factions[0].relationships).toEqual([
      { faction: 2, roll: 4, relation: 'Hostility' },
    ]);
  });

  it('adds adjacent hamlets and villages to an abbey parish', () => {
    const result = calcFactions(
      features({
        1: 'Abbey',
        2: 'Hamlet',
        3: 'Village',
        4: 'Hamlet',
        5: 'Lair',
        6: 'Hamlet',
        7: 'Dungeon',
        8: 'Hamlet',
      }),
      {},
      () => 2
    );

    expect(result.factions.length).toBe(1);
    expect(result.factions[0].label).toBe('Abbey 1');
    expect(result.factions[0].hexes).toEqual([1, 2, 3, 4, 6]);
    expect(result.hexFactions[5]).toEqual([]);
    expect(result.hexFactions[7]).toEqual([]);
    expect(result.hexFactions[8]).toEqual([]);
  });
});

describe('factions.ts lair factions', () => {
  it('merges adjacent lairs of the same creature on a 3-in-6 roll', () => {
    const result = calcFactions(
      features({ 1: 'Lair', 2: 'Lair' }),
      { lairInhabitants: { 1: 'Orcs', 2: 'Orcs' } },
      sequence([3], 2)
    );

    expect(result.factions.length).toBe(1);
    expect(result.factions[0].sources).toEqual([
      { hex: 1, type: 'lair', inhabitant: 'Orcs' },
      { hex: 2, type: 'lair', inhabitant: 'Orcs' },
    ]);
    expect(result.factions[0].label).toBe('Orcs lair 1 + Orcs lair 2');
    expect(result.factions[0].hexes).toEqual([1, 2]);
  });

  it('keeps adjacent lairs separate on a failed 3-in-6 roll', () => {
    const result = calcFactions(
      features({ 1: 'Lair', 2: 'Lair' }),
      { lairInhabitants: { 1: 'Orcs', 2: 'Orcs' } },
      () => 4
    );

    expect(result.factions.length).toBe(2);
    expect(result.contestedHexes).toEqual([]);
    expect(result.factions[0].relationships).toEqual([
      { faction: 2, roll: 8, relation: 'Indifference' },
    ]);
    expect(result.factions[1].relationships).toEqual([
      { faction: 1, roll: 8, relation: 'Indifference' },
    ]);
  });

  it('does not merge non-adjacent lairs of the same creature', () => {
    const result = calcFactions(
      features({ 1: 'Lair', 12: 'Lair' }),
      { lairInhabitants: { 1: 'Orcs', 12: 'Orcs' } },
      sequence([1], 4)
    );

    expect(result.factions.length).toBe(2);
    expect(result.factions[0].relationships).toEqual([]);
    expect(result.factions[1].relationships).toEqual([]);
  });

  it('does not merge adjacent lairs of different creatures', () => {
    const result = calcFactions(
      features({ 1: 'Lair', 2: 'Lair' }),
      { lairInhabitants: { 1: 'Orcs', 2: 'Goblins' } },
      sequence([1], 4)
    );

    expect(result.factions.length).toBe(2);
    expect(result.factions[0].relationships.length).toBe(1);
  });

  it('skips lairs with ordinary animals but allows an override predicate', () => {
    const skipped = calcFactions(
      features({ 1: 'Lair' }),
      { lairInhabitants: { 1: 'Wolves' } },
      () => 1
    );
    expect(skipped.factions).toEqual([]);

    const overridden = calcFactions(
      features({ 1: 'Lair' }),
      { lairInhabitants: { 1: 'Wolves' }, isLairFaction: () => true },
      () => 2
    );
    expect(overridden.factions.length).toBe(1);
    expect(overridden.factions[0].label).toBe('Wolves lair 1');

    const rejected = calcFactions(
      features({ 1: 'Lair' }),
      { lairInhabitants: { 1: 'Orcs' }, isLairFaction: () => false },
      () => 2
    );
    expect(rejected.factions).toEqual([]);
  });
});

describe('factions.ts relationships and events', () => {
  it('rolls a relationship for neighbouring factions', () => {
    const result = calcFactions(
      features({ 1: 'Tower', 2: 'Tower' }),
      {},
      sequence([1, 1], 2)
    );

    expect(result.factions.length).toBe(2);
    expect(result.factions[0].relationships).toEqual([
      { faction: 2, roll: 2, relation: 'Open war' },
    ]);
    expect(result.factions[1].relationships).toEqual([
      { faction: 1, roll: 2, relation: 'Open war' },
    ]);
  });

  it('does not roll a relationship for distant factions', () => {
    const result = calcFactions(
      features({ 1: 'Tower', 12: 'Tower' }),
      {},
      () => 2
    );

    expect(result.factions.length).toBe(2);
    expect(result.factions[0].relationships).toEqual([]);
    expect(result.factions[1].relationships).toEqual([]);
  });

  it('generates a faction event on a 1d6 result of 1', () => {
    const result = calcFactions(
      features({ 1: 'Tower' }),
      {},
      sequence([1, 3, 7], 2)
    );

    expect(result.factions[0].event).toEqual({
      when: 'Is happening now',
      nature: 'Negotiations with another faction',
    });
  });

  it('leaves the event empty when the 1d6 check is not 1', () => {
    const result = calcFactions(features({ 1: 'Tower' }), {}, () => 2);

    expect(result.factions[0].event).toBeNull();
  });
});
