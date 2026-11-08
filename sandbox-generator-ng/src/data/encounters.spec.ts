import { calcBiomeEncounter } from './lairs';
import {
  calcWildernessEncounter,
  tableContestedFactionCount,
  tableWildernessEncounter,
  type WildernessEncounterContext,
} from './encounters';

function sequence(values: number[], fallback = 1) {
  let index = 0;
  return (faces: number) => Math.min(values[index++] ?? fallback, faces);
}

function context(
  overrides: Partial<WildernessEncounterContext> = {}
): WildernessEncounterContext {
  return {
    hex: 1,
    biome: 'Grassland',
    hexFactions: {},
    ...overrides,
  };
}

describe('encounters.ts tables', () => {
  it('uses the 2023 wilderness encounter table', () => {
    expect(tableWildernessEncounter.dice).toBe('2d6');
    expect(Object.keys(tableWildernessEncounter.options).map(Number)).toEqual([
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
    expect(tableWildernessEncounter.options[2]).toBe('Dragon');
    expect(tableWildernessEncounter.options[3]).toBe('Other faction');
    expect(tableWildernessEncounter.options[4]).toBe('Faction');
    expect(tableWildernessEncounter.options[5]).toBe('Faction');
    expect(tableWildernessEncounter.options[6]).toBe('Faction');
    expect(tableWildernessEncounter.options[7]).toBe('NPCs');
    expect(tableWildernessEncounter.options[8]).toBe('Biome');
    expect(tableWildernessEncounter.options[9]).toBe('Biome');
    expect(tableWildernessEncounter.options[10]).toBe('Biome');
    expect(tableWildernessEncounter.options[11]).toBe('Biome');
    expect(tableWildernessEncounter.options[12]).toBe('Wizard');
  });

  it('uses the 2023 contested-hex faction count table', () => {
    expect(tableContestedFactionCount.dice).toBe('1d6');
    expect(Object.keys(tableContestedFactionCount.options).map(Number)).toEqual([
      1, 2, 3, 4, 5, 6,
    ]);
    expect(tableContestedFactionCount.options[1]).toBe('Only one');
    expect(tableContestedFactionCount.options[2]).toBe('Only one');
    expect(tableContestedFactionCount.options[3]).toBe('Only one');
    expect(tableContestedFactionCount.options[4]).toBe('Only one');
    expect(tableContestedFactionCount.options[5]).toBe('Multiple');
    expect(tableContestedFactionCount.options[6]).toBe('Multiple');
  });
});

describe('encounters.ts non-faction results', () => {
  it('returns a dragon encounter on a 2d6 result of 2', () => {
    const result = calcWildernessEncounter(context(), sequence([1, 1]));

    expect(result.roll).toBe(2);
    expect(result.category).toBe('Dragon');
    expect(result.note).toContain('lair');
    expect(result.factions).toEqual([]);
    expect(result.monster).toBeNull();
    expect(result.fallback).toBe(false);
    expect(result.dragon?.name).toBe('Arkos');
    expect(result.npc).toBeNull();
    expect(result.wizard).toBeNull();
  });

  it('returns friendly NPCs on a 2d6 result of 7', () => {
    const result = calcWildernessEncounter(context(), sequence([3, 4]));

    expect(result.roll).toBe(7);
    expect(result.category).toBe('NPCs');
    expect(result.note).toContain('Friendly NPCs');
    expect(result.factions).toEqual([]);
    expect(result.npc?.name).toBe('Ann Briggs');
    expect(result.npc?.occupation).toBe('Accountant');
    expect(result.dragon).toBeNull();
    expect(result.wizard).toBeNull();
  });

  it('returns a biome monster on an 8-11 result', () => {
    // 2d6 = 8, then Grassland 2d6 = 2 -> Dinosaurs.
    const result = calcWildernessEncounter(context(), sequence([4, 4, 1, 1]));

    expect(result.roll).toBe(8);
    expect(result.category).toBe('Biome');
    expect(result.monster).toBe('Dinosaurs');
    expect(result.factions).toEqual([]);
    expect(result.fallback).toBe(false);
    expect(result.dragon).toBeNull();
    expect(result.npc).toBeNull();
    expect(result.wizard).toBeNull();
  });

  it('returns a wizard encounter on a 2d6 result of 12', () => {
    const result = calcWildernessEncounter(context(), sequence([6, 6]));

    expect(result.roll).toBe(12);
    expect(result.category).toBe('Wizard');
    expect(result.note).toContain('tower');
    expect(result.factions).toEqual([]);
    expect(result.wizard?.level).toBe(7);
    expect(result.dragon).toBeNull();
    expect(result.npc).toBeNull();
  });
});

describe('encounters.ts faction results', () => {
  it('uses the current hex faction', () => {
    const result = calcWildernessEncounter(
      context({ hexFactions: { 1: [3] } }),
      sequence([2, 2])
    );

    expect(result.category).toBe('Faction');
    expect(result.factions).toEqual([3]);
    expect(result.factionCount).toBe('one');
    expect(result.contested).toBe(false);
    expect(result.fallback).toBe(false);
  });

  it('uses an adjacent faction for an Other faction result', () => {
    const result = calcWildernessEncounter(
      context({ hexFactions: { 1: [], 2: [4] } }),
      sequence([1, 2])
    );

    expect(result.category).toBe('Other faction');
    expect(result.factions).toEqual([4]);
    expect(result.fallback).toBe(false);
  });

  it('picks one of several adjacent factions for an Other faction result', () => {
    const result = calcWildernessEncounter(
      context({ hexFactions: { 2: [4], 3: [5] } }),
      sequence([1, 2, 1])
    );

    expect(result.category).toBe('Other faction');
    expect(result.factions).toEqual([4]);
  });

  it('uses a custom adjacency lookup', () => {
    const result = calcWildernessEncounter(
      context({ hexFactions: { 5: [7] }, neighbors: () => [5] }),
      sequence([1, 2])
    );

    expect(result.factions).toEqual([7]);
  });

  it('picks a single faction in a contested hex on 1-4', () => {
    // 2d6 = 4, contested 1d6 = 3 (only one), then pick 1d2 = 2.
    const result = calcWildernessEncounter(
      context({ hexFactions: { 1: [1, 2] } }),
      sequence([2, 2, 3, 2])
    );

    expect(result.contested).toBe(true);
    expect(result.factionCount).toBe('one');
    expect(result.factions).toEqual([2]);
  });

  it('keeps multiple factions in a contested hex on 5-6', () => {
    const result = calcWildernessEncounter(
      context({ hexFactions: { 1: [1, 2] } }),
      sequence([2, 2, 5])
    );

    expect(result.contested).toBe(true);
    expect(result.factionCount).toBe('multiple');
    expect(result.factions).toEqual([1, 2]);
  });

  it('falls back to a biome encounter when no faction is nearby', () => {
    // Faction on 2d6 = 4, then Grassland 2d6 = 2 -> Dinosaurs.
    const result = calcWildernessEncounter(context(), sequence([2, 2, 1, 1]));

    expect(result.category).toBe('Faction');
    expect(result.fallback).toBe(true);
    expect(result.monster).toBe('Dinosaurs');
    expect(result.factions).toEqual([]);
    expect(result.note).toContain('biome encounter');
  });

  it('falls back to a biome encounter for Other faction when no faction is nearby', () => {
    const result = calcWildernessEncounter(context(), sequence([1, 2, 1, 1]));

    expect(result.category).toBe('Other faction');
    expect(result.fallback).toBe(true);
    expect(result.monster).toBe('Dinosaurs');
  });

  it('uses an adjacent faction when a Faction result hits an empty current hex', () => {
    const result = calcWildernessEncounter(
      context({ hexFactions: { 2: [4] } }),
      sequence([2, 2])
    );

    expect(result.category).toBe('Faction');
    expect(result.factions).toEqual([4]);
    expect(result.fallback).toBe(false);
  });
});

describe('lairs.ts calcBiomeEncounter', () => {
  it('rolls on the fitting biome table', () => {
    expect(calcBiomeEncounter('Grassland', sequence([1, 1]))).toBe('Dinosaurs');
    expect(calcBiomeEncounter('Marsh', sequence([1, 1]))).toBe('Moth-men');
    expect(calcBiomeEncounter('Forest', sequence([1, 1]))).toBe('Ents');
    expect(calcBiomeEncounter('Mountains', sequence([1, 1]))).toBe('Giants');
    expect(calcBiomeEncounter('Hills', sequence([1, 1]))).toBe('Manticores');
  });

  it('rejects an unknown biome', () => {
    expect(() => calcBiomeEncounter('Desert', () => 1)).toThrowError(
      'Unknown biome: Desert'
    );
  });
});
