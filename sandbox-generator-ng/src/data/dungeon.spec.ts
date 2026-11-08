import { calcDungeon, calcDungeonCorridor } from './dungeon';
import {
  dungeonRandomTables,
  tableDungeonEmptyRoom,
  tableDungeonSpecialRoom,
  tableDungeonTrap,
} from './dungeon-tables';

describe('dungeon.ts calcDungeon', () => {
  it('creates an area with levels, factions, a six-in-six encounter table, and rooms', () => {
    const dungeon = calcDungeon({ rollFn: () => 1 });
    const area = dungeon.areas[0];
    const level = area.levels[0];

    expect(dungeon.areas.length).toBe(1);
    expect(area.name).toEqual({
      prefixRoll: 1,
      nounRoll: 1,
      result: 'Burrow(s) of Death',
    });
    expect(area.themeRoll).toBe(1);
    expect(area.theme).toBe('None');
    expect(level.depth).toBe(1);
    expect(level.roomCount).toBe(12);
    expect(level.factions.length).toBe(2);
    expect(level.factionRelationships[0].relationship).toBe('Open war');
    expect(level.factionRelationships[0].firstFaction).toBe(1);
    expect(level.wanderingMonsters.reduce((total, entry) => total + entry.chance, 0)).toBe(6);
    expect(level.rooms.length).toBe(level.roomCount);
    expect(level.rooms[0].type).toBe('trap');
    expect(level.rooms[0].detail).toEqual({
      table: 'Dungeon Trap',
      roll: 1,
      result: 'Acid pool',
    });
    expect(level.rooms[0].treasureChance).toBe(25);
    expect(level.rooms[0].hasTreasure).toBe(true);
  });

  it('uses the monster-level table for every dungeon depth', () => {
    const depths = [1, 2, 3, 4, 5, 6] as const;
    const expectedLevels = [3, 4, 5, 5, 4, 3];

    for (const [index, depth] of depths.entries()) {
      let sixSidedRoll = 0;
      const dungeon = calcDungeon({
        rollFn: (faces) => {
          if (faces === 6) {
            sixSidedRoll++;
            return sixSidedRoll === 1 ? 1 : sixSidedRoll === 2 ? depth : faces;
          }
          return faces;
        },
      });

      expect(dungeon.areas[0].levels[0].depth).toBe(depth);
      expect(dungeon.areas[0].levels[0].factions[0].monster.level)
        .withContext(`depth ${depth}`)
        .toBe(expectedLevels[index]);
    }
  });

  it('maps each d100 trap roll to the corresponding one of 50 table results', () => {
    const dungeon = calcDungeon({ rollFn: (faces) => faces === 100 ? 100 : 1 });
    const trap = dungeon.areas[0].levels[0].rooms[0].detail;

    expect(trap).toEqual({ table: 'Dungeon Trap', roll: 100, result: 'Wolf trap' });
  });

  it('models each catalogued dungeon table with a result for every possible roll', () => {
    for (const table of dungeonRandomTables) {
      const keys = Object.keys(table.options).map(Number).sort((a, b) => a - b);
      const [diceCount, diceFaces] = (table.dice ?? `1d${keys.length}`)
        .split('d')
        .map(Number);
      const possibleRolls = Array.from(
        { length: diceCount * diceFaces - diceCount + 1 },
        (_, index) => diceCount + index,
      );
      expect(keys).withContext(table.title).toEqual(possibleRolls);
      for (const key of keys) {
        expect(table.options[key]).withContext(`${table.title}, roll ${key}`).toBeTruthy();
      }
    }

    expect(Object.keys(tableDungeonTrap.options)).toHaveSize(100);
    expect(Object.keys(tableDungeonEmptyRoom.options)).toHaveSize(100);
    expect(Object.keys(tableDungeonSpecialRoom.options)).toHaveSize(100);
  });

  it('resolves area names and themes from the Cross section tables', () => {
    const dungeon = calcDungeon({
      rollFn: (faces) => faces === 20 ? 19 : faces === 12 ? 12 : 1,
    });
    const area = dungeon.areas[0];

    expect(area.name.result).toBe('Twilight Tunnel(s)');
    expect(area.name.prefixRoll).toBe(19);
    expect(area.name.nounRoll).toBe(12);
    expect(area.themeRoll).toBe(19);
    expect(area.theme).toBe('Haunted');
  });

  it('generates the requested areas and valid links between adjacent areas', () => {
    const dungeon = calcDungeon({ areaCount: 2, rollFn: (faces) => faces });

    expect(dungeon.areas.map((area) => area.number)).toEqual([1, 2]);
    expect(dungeon.links.filter((link) => link.fromArea === 0)).toHaveSize(2);
    const crossAreaLinks = dungeon.links.filter(
      (link) => link.fromArea === 1 && link.toArea === 2,
    );
    expect(crossAreaLinks).toHaveSize(6);
    for (const link of crossAreaLinks) {
      const source = dungeon.areas[link.fromArea - 1].levels[link.fromLevel - 1];
      const target = dungeon.areas[link.toArea - 1].levels[link.toLevel - 1];
      expect(Math.abs(source.depth - target.depth)).toBeLessThanOrEqual(1);
    }
  });

  it('rejects a non-positive area count', () => {
    expect(() => calcDungeon({ areaCount: 0, rollFn: () => 1 })).toThrowError(
      RangeError,
      'Dungeon areaCount must be a positive integer.',
    );
  });

  it('generates corridor sections and excludes stairs to missing levels', () => {
    let endRoll = 0;
    const corridor = calcDungeonCorridor({
      hasDeeperLevel: false,
      hasHigherLevel: false,
      rollFn: (faces) => {
        if (faces === 8) {
          endRoll++;
          return endRoll === 1 ? 8 : 6;
        }
        return faces;
      },
    });

    expect(corridor.sections.length).toBe(3);
    expect(corridor.end).toBe('Door/Portcullis');
    expect(endRoll).toBe(2);
  });

  it('preserves dungeon invariants across varied rolls', () => {
    let seed = 41;
    const rollFn = (faces: number) => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return (seed % faces) + 1;
    };
    const dungeon = calcDungeon({ areaCount: 4, rollFn });

    for (const area of dungeon.areas) {
      expect(area.levels.length).toBeGreaterThanOrEqual(1);
      expect(area.levels.length).toBeLessThanOrEqual(6);
      for (const level of area.levels) {
        expect(level.rooms.length).toBe(level.roomCount);
        expect(
          level.wanderingMonsters.reduce((total, entry) => total + entry.chance, 0),
        ).toBe(6);
        for (const room of level.rooms) {
          expect(room.length).toBeGreaterThan(0);
          expect(room.width).toBeGreaterThan(0);
          expect(room.hasTreasure === null).toBe(room.treasureChance === null);
          if (room.type === 'monsters') {
            expect(room.monster).not.toBeNull();
          }
        }
      }
    }
  });
});
