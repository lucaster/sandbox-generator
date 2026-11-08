import {
  calcDungeon,
  calcDungeonCorridor,
  getDungeonSpecialRoomTableActions,
  rollDungeonSpecialRoomTable,
} from './dungeon';
import {
  dungeonRandomTables,
  tableDungeonCryingStatueTreasure,
  tableDungeonDivineAltarOfferingThresholds,
  tableDungeonEmptyRoom,
  tableDungeonFleshRoomDefense,
  tableDungeonRoomOutOfTimeEra,
  tableDungeonRotatingRoomAngle,
  tableDungeonSlotMachinePayout,
  tableDungeonSpecialRoom,
  tableDungeonTrap,
  tableDungeonTrueIntentions,
  tableDungeonValuableMonsterPartHarvest,
  tableDungeonValuableMonsterPartValue,
  tableDungeonVendingMachineContents,
  tableDungeonVortexDestination,
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
      if (table.dice !== undefined || keys[0] === 1) {
        const [diceCount, diceFaces] = (table.dice ?? `1d${keys.length}`)
          .split('d')
          .map(Number);
        const possibleRolls = Array.from(
          { length: diceCount * diceFaces - diceCount + 1 },
          (_, index) => diceCount + index,
        );
        expect(keys).withContext(table.title).toEqual(possibleRolls);
      } else {
        expect(table.dice).withContext(table.title).toBeUndefined();
      }
      for (const key of keys) {
        expect(table.options[key]).withContext(`${table.title}, roll ${key}`).toBeTruthy();
      }
    }

    expect(Object.keys(tableDungeonTrap.options)).toHaveSize(100);
    expect(Object.keys(tableDungeonEmptyRoom.options)).toHaveSize(100);
    expect(Object.keys(tableDungeonSpecialRoom.options)).toHaveSize(100);
  });

  it('models the nested special-room tables shown in the 2023 manual', () => {
    expect(tableDungeonCryingStatueTreasure.options).toEqual({
      1: 'Pouch with 1d20 gp',
      2: 'Pouch with 1d20 gp',
      3: 'Pouch with 1d20 gp',
      4: '1 gem',
      5: '1 gem',
      6: 'Potion',
    });
    expect(tableDungeonDivineAltarOfferingThresholds.options).toEqual({
      150: 'Answer to a question',
      250: 'Completely heal the party',
      1000: 'Resurrect someone',
    });
    expect(tableDungeonFleshRoomDefense.options[4]).toBe(
      '1d3 tentacles: 1d6 damage each, roll against wands to avoid',
    );
    expect(tableDungeonFleshRoomDefense.options[6]).toBe(
      'Mouth: save against paralysis or die',
    );
    expect(tableDungeonRoomOutOfTimeEra.options).toEqual({
      1: 'Distant past',
      2: 'Distant past',
      3: 'Distant past',
      4: 'Distant past',
      5: 'Future',
      6: 'Future',
    });
    expect(tableDungeonRotatingRoomAngle.options).toEqual({
      1: '90°',
      2: '90°',
      3: '90°',
      4: '180°',
      5: '180°',
      6: '270°',
    });
    expect(tableDungeonSlotMachinePayout.options).toEqual({
      111: 'Multiplies the bet by 2',
      222: 'Multiplies the bet by 3',
      333: 'Multiplies the bet by 5',
      444: 'Gives a random gem',
      555: 'Opens a trapdoor under the feet of the characters, that leads them to the level below',
      666: 'Summons a lesser demon',
    });
    expect(tableDungeonTrueIntentions.options[6]).toBe('To impress their lover');
    expect(tableDungeonValuableMonsterPartHarvest.options[6]).toBe(
      'The part must be collected on a living monster',
    );
    expect(tableDungeonValuableMonsterPartValue.options[6]).toBe('(1d6 + 1d3) × 100 gp');
    expect(tableDungeonVendingMachineContents.options).toEqual({
      1: 'Rations',
      2: 'Rations',
      3: 'Rations',
      4: 'Healing potion',
      5: 'Healing potion',
      6: 'Random scroll',
    });
    expect(tableDungeonVortexDestination.options).toEqual({
      1: 'Another room',
      2: 'Another room',
      3: 'Another room',
      4: 'Outside of the dungeon',
      5: 'Outside of the dungeon',
      6: 'Another dungeon',
    });
  });

  it('connects nested special-room tables to contextual rolls and references', () => {
    const cryingStatue = getDungeonSpecialRoomTableActions('Crying statues')[0];
    expect(rollDungeonSpecialRoomTable(cryingStatue, () => 4)).toEqual({
      table: 'Crying Statue Treasure',
      rolls: [4],
      results: ['1 gem'],
    });

    const altar = getDungeonSpecialRoomTableActions('Divine altar')[0];
    expect(altar.kind).toBe('reference');
    expect(() => rollDungeonSpecialRoomTable(altar, () => 1)).toThrowError(
      RangeError,
      'Divine Altar Offering Thresholds is a reference table, not a random table.',
    );

    expect(rollDungeonSpecialRoomTable(
      getDungeonSpecialRoomTableActions('Flesh room')[0],
      () => 4,
    ).results).toEqual(['1d3 tentacles: 1d6 damage each, roll against wands to avoid']);
    expect(rollDungeonSpecialRoomTable(
      getDungeonSpecialRoomTableActions('Room out of time')[0],
      () => 5,
    ).results).toEqual(['Future']);
    expect(rollDungeonSpecialRoomTable(
      getDungeonSpecialRoomTableActions('Rotating room')[0],
      () => 6,
    ).results).toEqual(['270°']);
    expect(rollDungeonSpecialRoomTable(
      getDungeonSpecialRoomTableActions('True intentions room')[0],
      () => 6,
    ).results).toEqual(['To impress their lover']);

    const valuablePartActions = getDungeonSpecialRoomTableActions('Valuable monster (part)');
    expect(rollDungeonSpecialRoomTable(valuablePartActions[0], () => 6).rolls).toEqual([6]);
    expect(rollDungeonSpecialRoomTable(valuablePartActions[1], () => 6).results)
      .toEqual(['(1d6 + 1d3) × 100 gp']);

    const vendingRolls = [1, 4, 6];
    let vendingRollIndex = 0;
    expect(rollDungeonSpecialRoomTable(
      getDungeonSpecialRoomTableActions('Vending machine')[0],
      () => vendingRolls[vendingRollIndex++],
    )).toEqual({
      table: 'Vending Machine Contents',
      rolls: [1, 4, 6],
      results: ['Rations', 'Healing potion', 'Random scroll'],
    });
    expect(rollDungeonSpecialRoomTable(
      getDungeonSpecialRoomTableActions('Vortex')[0],
      () => 6,
    ).results).toEqual(['Another dungeon']);
  });

  it('rolls three slot-machine dice and pays only on matching numbers', () => {
    const slotMachine = getDungeonSpecialRoomTableActions('Slot machine')[0];
    const matchingRolls = [4, 4, 4];
    let matchingRollIndex = 0;
    expect(rollDungeonSpecialRoomTable(
      slotMachine,
      () => matchingRolls[matchingRollIndex++],
    )).toEqual({
      table: 'Slot Machine Matching Numbers',
      rolls: [4, 4, 4],
      results: ['Gives a random gem'],
    });

    const nonMatchingRolls = [1, 2, 3];
    let nonMatchingRollIndex = 0;
    expect(rollDungeonSpecialRoomTable(
      slotMachine,
      () => nonMatchingRolls[nonMatchingRollIndex++],
    )).toEqual({
      table: 'Slot Machine Matching Numbers',
      rolls: [1, 2, 3],
      results: ['No matching numbers; nothing happens'],
    });
  });

  it('keeps all special-room tables in the order they appear in the manual', () => {
    const firstNestedTable = dungeonRandomTables.indexOf(tableDungeonSpecialRoom) + 1;
    const nestedTableTitles = dungeonRandomTables
      .slice(firstNestedTable)
      .map((table) => table.title);

    expect(nestedTableTitles).toEqual([
      'Body Exchange Duration',
      'Body Exchange Reappearance',
      'Crying Statue Treasure',
      'Divine Altar Offering Thresholds',
      'Flesh Room Defense',
      'Freshly Walled Corridor',
      'High Up Item',
      'Key Condition',
      'Magic Forge Result',
      'Magic Fountain Siren Intentions',
      'Magic Stairs Destination',
      'Medicine Cabinet Treatment',
      'Minecart Destination',
      'Moving Statues Blocked Exits',
      'Mutation',
      'Orb Transformation',
      'Petrified Adventurer Cause',
      'Petrified Adventurer Outcome',
      'Powerful Electromagnet Setting',
      'Room Out of Time Era',
      'Rotating Room Angle',
      'Slot Machine Matching Numbers',
      'Switch in a Hole',
      'Talking Basin Answer',
      'True Intentions',
      'Valuable Monster Part Harvesting Method',
      'Valuable Monster Part Value',
      'Vending Machine Contents',
      'Vortex Destination',
      'Wheel of Fortune',
    ]);
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
