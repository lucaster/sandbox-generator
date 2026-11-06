import {
  calcAbbey,
  calcAbbeyEvent,
  calcAbbeyFame,
  calcAbbeyHistory,
  calcAbbeyName,
  calcCastle,
  calcCastleDefense,
  calcCastleDisposition,
  calcCastleEvent,
  calcCastleGarrison,
  calcCastleKeep,
  calcCastleName,
  calcCastleTreasure,
  calcCity,
  calcCityAppearance,
  calcCityBuildings,
  calcCityCharacteristics,
  calcCityDefense,
  calcCityDisposition,
  calcHamlet,
  calcTower,
  calcTowerWizard,
  calcVillage,
  tableCastleCondition,
  tableCastleDefensiveStructures,
  tableCastleDisposition,
  tableCityBuildingType,
  tableCitySize,
  tableHamletDisposition,
  tableAbbeyEventWhen,
  tableAbbeyFame,
  tableAbbeyRelicSpellLevel,
  tableAbbeySize,
  tableTowerAbovegroundLevels,
  tableTowerConnection,
  tableTowerDetails,
  tableTowerUndergroundLevels,
  tableTowerWizardLevel,
} from './settlements';

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

describe('settlements.ts city tables', () => {
  it('maps city size to the 2023 edition size factors', () => {
    expect(tableCitySize.options[1]).toBe('Medium');
    expect(tableCitySize.options[3]).toBe('Medium');
    expect(tableCitySize.options[4]).toBe('Small');
    expect(tableCitySize.options[5]).toBe('Small');
    expect(tableCitySize.options[6]).toBe('Big');
  });

  it('groups building types like the 2023 edition', () => {
    expect(tableCityBuildingType.options[1]).toBe('Housing');
    expect(tableCityBuildingType.options[3]).toBe('Housing');
    expect(tableCityBuildingType.options[4]).toBe('Business');
    expect(tableCityBuildingType.options[10]).toBe('Business');
    expect(tableCityBuildingType.options[11]).toBe('Official');
    expect(tableCityBuildingType.options[13]).toBe('Official');
    expect(tableCityBuildingType.options[14]).toBe('Religious');
    expect(tableCityBuildingType.options[15]).toBe('Public');
    expect(tableCityBuildingType.options[17]).toBe('Public');
    expect(tableCityBuildingType.options[18]).toBe('Military');
    expect(tableCityBuildingType.options[20]).toBe('Military');
  });
});

describe('settlements.ts calcCityCharacteristics', () => {
  it('returns two distinct characteristics', () => {
    expect(calcCityCharacteristics(sequence([6, 7]))).toEqual([
      'Corrupt',
      'Crowded',
    ]);
  });

  it('rerolls a duplicate', () => {
    expect(calcCityCharacteristics(sequence([6, 6, 8]))).toEqual([
      'Corrupt',
      'Destroyed',
    ]);
  });

  it('drops Nothing results', () => {
    expect(calcCityCharacteristics(sequence([1, 2]))).toEqual([]);
  });
});

describe('settlements.ts calcCityAppearance', () => {
  it('rolls a normal appearance', () => {
    expect(calcCityAppearance(sequence([3]))).toEqual({
      key: 3,
      result: 'Colorful',
    });
  });

  it('resolves the color scheme follow-up', () => {
    expect(calcCityAppearance(sequence([20, 3]))).toEqual({
      key: 20,
      result: 'Specific color scheme: Blue and white',
    });
  });
});

describe('settlements.ts calcCityBuildings', () => {
  it('rolls three buildings per city size and resolves each type', () => {
    const buildings = calcCityBuildings(
      2,
      sequence([1, 1, 4, 3, 11, 4, 14, 3, 15, 10, 18, 2])
    );

    expect(buildings).toEqual([
      { type: 'Housing', name: 'Studio' },
      { type: 'Business', name: 'Animal trainer' },
      { type: 'Official', name: 'City hall' },
      { type: 'Religious', name: 'Church' },
      { type: 'Public', name: 'Hospital' },
      { type: 'Military', name: 'Barracks' },
    ]);
  });

  it('maps the business d100 ranges', () => {
    const buildings = calcCityBuildings(
      1,
      sequence([4, 100, 4, 51, 4, 81])
    );

    expect(buildings.map((building) => building.name)).toEqual([
      'Wine shop',
      'General store',
      'Siege engines seller',
    ]);
  });
});

describe('settlements.ts calcCityDefense', () => {
  it('generates unique entrances, closures, guards, and supplies for a walled city', () => {
    const defense = calcCityDefense(2, sequence([1, 1, 2, 1, 6, 1, 3, 4]));

    expect(defense.walled).toBe(true);
    expect(defense.entrances).toEqual([
      { direction: 'North', towers: 2, closure: 'Wooden doors' },
      { direction: 'East', towers: 2, closure: 'Both' },
    ]);
    expect(defense.guards).toBe(40);
    expect(defense.siegeSuppliesMonths).toBe(7);
  });

  it('skips walls, entrances, and supplies when the city is not walled', () => {
    const defense = calcCityDefense(3, sequence([4, 2]));

    expect(defense.walled).toBe(false);
    expect(defense.entrances).toEqual([]);
    expect(defense.guards).toBe(75);
    expect(defense.siegeSuppliesMonths).toBeNull();
  });
});

describe('settlements.ts calcCityDisposition', () => {
  it('uses the opposite disposition for the ruler', () => {
    const disposition = calcCityDisposition(sequence([1, 1, 5]));

    expect(disposition.cityDisposition.result).toBe('Attack on sight');
    expect(disposition.rulerDisposition.result).toBe('Enthusiastic');
  });

  it('uses the neutral ruler table', () => {
    const hostile = calcCityDisposition(sequence([3, 3, 2]));
    expect(hostile.cityDisposition.result).toBe('Neutral');
    expect(hostile.rulerDisposition.result).toBe('Hostile');

    const welcoming = calcCityDisposition(sequence([3, 3, 4]));
    expect(welcoming.cityDisposition.result).toBe('Neutral');
    expect(welcoming.rulerDisposition.result).toBe('Welcoming');
  });
});

describe('settlements.ts calcCity', () => {
  it('generates a complete city from the 2023 edition procedure', () => {
    const city = calcCity(
      sequence([
        4,
        2, 3,
        6, 7,
        2,
        1, 2,
        1, 1, 4, 3, 11, 4, 14, 3, 15, 10, 18, 2,
        1,
        1, 2,
        1, 6,
        1,
        3, 4,
        1, 5,
        1,
        3, 3,
        4,
        2,
      ])
    );

    expect(city.size.result).toBe('Small');
    expect(city.population).toBe(1000);
    expect(city.occupations.map((entry) => entry.result)).toEqual([
      'Cattle breeding (farms, meadows)',
      'Farming crops (farms, fields)',
    ]);
    expect(city.characteristics).toEqual(['Corrupt', 'Crowded']);
    expect(city.appearance.result).toBe('Cobblestone');
    expect(city.generalLocations).toEqual([
      '2 Blacksmiths',
      '2 Cemeteries',
      '2 Churches',
      '2 General stores',
      '2 Libraries',
      '2 Markets',
      '2 Stables',
      '2 Taverns',
    ]);
    expect(city.specialLocations.map((entry) => entry.result)).toEqual([
      'Abandoned building',
      'Aqueduct',
    ]);
    expect(city.buildingsOfInterest).toEqual([
      { type: 'Housing', name: 'Studio' },
      { type: 'Business', name: 'Animal trainer' },
      { type: 'Official', name: 'City hall' },
      { type: 'Religious', name: 'Church' },
      { type: 'Public', name: 'Hospital' },
      { type: 'Military', name: 'Barracks' },
    ]);
    expect(city.defense).toEqual({
      walled: true,
      entrances: [
        { direction: 'North', towers: 2, closure: 'Wooden doors' },
        { direction: 'East', towers: 2, closure: 'Both' },
      ],
      guards: 40,
      siegeSuppliesMonths: 7,
    });
    expect(city.people.ruler.result).toBe('Noble');
    expect(city.people.notableNpcs.map((entry) => entry.result)).toEqual([
      'Aggressive guard',
      'Clever orphan',
    ]);
    expect(city.disposition.cityDisposition.result).toBe('Neutral');
    expect(city.disposition.rulerDisposition.result).toBe('Welcoming');
    expect(city.event.hasEvent).toBe(false);
    expect(city.event.whenEventHappens).toBeNull();
    expect(city.event.eventNature).toBeNull();
  });

  it('scales population and counts with the city size factor', () => {
    const city = calcCity(seeded(1));
    const factor = {
      Small: 2,
      Medium: 3,
      Big: 4,
    }[city.size.result] as number;

    expect(factor).toBeGreaterThanOrEqual(2);
    expect(city.population).toBe(factor * 500);
    expect(city.occupations.length).toBe(factor);
    expect(city.specialLocations.length).toBe(factor);
    expect(city.buildingsOfInterest.length).toBe(factor * 3);
    expect(city.people.notableNpcs.length).toBe(factor);
    expect(city.generalLocations.length).toBe(8);
    expect(city.generalLocations[0]).toBe(`${factor} Blacksmiths`);
  });
});

describe('settlements.ts castle tables', () => {
  it('groups the general condition like the 2023 edition', () => {
    expect(tableCastleCondition.options[1]).toBe('Perfect');
    expect(tableCastleCondition.options[2]).toBe('Worn');
    expect(tableCastleCondition.options[3]).toBe('Worn');
    expect(tableCastleCondition.options[4]).toBe('Aged');
    expect(tableCastleCondition.options[5]).toBe('Aged');
    expect(tableCastleCondition.options[6]).toBe('Crumbling');
  });

  it('uses 2d6 and the 2023 edition disposition groups', () => {
    expect(tableCastleDisposition.dice).toBe('2d6');
    expect(tableCastleDisposition.options[2]).toBe('Attack on sight');
    expect(tableCastleDisposition.options[3]).toBe('Hostile');
    expect(tableCastleDisposition.options[5]).toBe('Hostile');
    expect(tableCastleDisposition.options[6]).toBe('Neutral');
    expect(tableCastleDisposition.options[8]).toBe('Neutral');
    expect(tableCastleDisposition.options[9]).toBe('Welcoming');
    expect(tableCastleDisposition.options[11]).toBe('Welcoming');
    expect(tableCastleDisposition.options[12]).toBe('Enthusiastic');
  });

  it('groups the defensive structures', () => {
    expect(tableCastleDefensiveStructures.options[1]).toBe('Stone walls and towers');
    expect(tableCastleDefensiveStructures.options[2]).toBe('Stone walls and towers');
    expect(tableCastleDefensiveStructures.options[3]).toBe('Stone walls and towers');
    expect(tableCastleDefensiveStructures.options[4]).toBe('Moat (= trench)');
    expect(tableCastleDefensiveStructures.options[5]).toBe('Motte (= mound)');
    expect(tableCastleDefensiveStructures.options[6]).toBe('Wooden palisade');
  });
});

describe('settlements.ts calcCastleName', () => {
  it('composes a name from the 1d30 and 1d24 tables', () => {
    expect(calcCastleName(sequence([9, 13]))).toBe('Castle Dark Moor');
  });
});

describe('settlements.ts calcCastleTreasure', () => {
  it('rolls both gold amounts and each treasure chance independently', () => {
    const treasure = calcCastleTreasure(
      sequence([1, 3, 1, 1, 1, 3, 3, 2, 1, 8, 1, 4])
    );

    expect(treasure).toEqual({
      goldPieces: 35000,
      gems: 8,
      jewelry: 8,
      magicItems: 4,
      scrolls: 4,
    });
  });

  it('returns an empty treasure when every chance fails', () => {
    const treasure = calcCastleTreasure(sequence([2, 2, 2, 2, 100]));

    expect(treasure).toEqual({
      goldPieces: 0,
      gems: 0,
      jewelry: 0,
      magicItems: 0,
      scrolls: 0,
    });
  });
});

describe('settlements.ts calcCastleKeep', () => {
  it('rolls the shape, levels, features, jails, supplies, and treasure', () => {
    const keep = calcCastleKeep(
      sequence([
        4, 2, 11, 10, 3, 4, 2, 5, 6, 2, 2, 2, 2, 100,
      ])
    );

    expect(keep.shape.result).toBe('Round');
    expect(keep.levels).toBe(3);
    expect(keep.defensiveFeature.result).toBe('Iron spikes');
    expect(keep.nonDefensiveFeature.result).toBe('Overgrown');
    expect(keep.jails).toEqual({ commoners: 7, nobles: 2 });
    expect(keep.suppliesMonths).toBe(11);
    expect(keep.treasure).toEqual({
      goldPieces: 0,
      gems: 0,
      jewelry: 0,
      magicItems: 0,
      scrolls: 0,
    });
  });
});

describe('settlements.ts calcCastleDefense', () => {
  it('builds towers, walls, gatehouse, and moat for a walled and moated castle', () => {
    const defense = calcCastleDefense(
      sequence([2, 1, 4, 2, 7, 10, 4, 6])
    );

    expect(defense.structures.map((structure) => structure.result)).toEqual([
      'Stone walls and towers',
      'Moat (= trench)',
    ]);
    expect(defense.towersAndWalls).toEqual({
      shape: { key: 2, result: 'Trapezium' },
      towers: 4,
      defensiveFeature: { key: 7, result: 'Ballista' },
      nonDefensiveFeature: { key: 10, result: 'Overgrown' },
    });
    expect(defense.gatehouse).toEqual({
      key: 4,
      result: 'Drawbridge',
    });
    expect(defense.moatEncounter).toEqual({
      key: 6,
      result: 'Electric eels',
    });
  });

  it('skips towers, gatehouse, and moat when neither is present', () => {
    const defense = calcCastleDefense(sequence([1, 5]));

    expect(defense.structures.map((structure) => structure.result)).toEqual([
      'Motte (= mound)',
    ]);
    expect(defense.towersAndWalls).toBeNull();
    expect(defense.gatehouse).toBeNull();
    expect(defense.moatEncounter).toBeNull();
  });

  it('rolls a moat encounter without walls', () => {
    const defense = calcCastleDefense(sequence([1, 4, 5]));

    expect(defense.structures.map((structure) => structure.result)).toEqual([
      'Moat (= trench)',
    ]);
    expect(defense.towersAndWalls).toBeNull();
    expect(defense.gatehouse).toBeNull();
    expect(defense.moatEncounter?.result).toBe('Crocodiles');
  });

  it('rolls 1d3+3 towers for a circular wall', () => {
    const defense = calcCastleDefense(sequence([1, 1, 8, 2, 7, 10, 1]));

    expect(defense.towersAndWalls?.shape.result).toBe('Circle');
    expect(defense.towersAndWalls?.towers).toBe(5);
  });
});

describe('settlements.ts calcCastleGarrison', () => {
  it('derives the garrison composition and command levels', () => {
    const garrison = calcCastleGarrison(sequence([5, 5, 4]));

    expect(garrison.total).toBe(140);
    expect(garrison.composition.map((entry) => entry.count)).toEqual([
      14, 14, 14, 56, 14, 14, 14,
    ]);
    expect(garrison.lord.level).toBe(11);
    expect(garrison.lieutenant.level).toBe(9);
    expect(garrison.bodyguards).toEqual({ count: 6, level: 6 });
  });

  it('keeps the lord at level 9 for a small garrison', () => {
    const garrison = calcCastleGarrison(sequence([1, 1, 1]));

    expect(garrison.total).toBe(30);
    expect(garrison.lord.level).toBe(9);
    expect(garrison.lieutenant.level).toBe(7);
    expect(garrison.bodyguards).toEqual({ count: 6, level: 4 });
  });
});

describe('settlements.ts calcCastleDisposition', () => {
  it('uses the 2d6 groups', () => {
    expect(calcCastleDisposition(sequence([1, 1]))).toEqual({
      key: 2,
      result: 'Attack on sight',
    });
    expect(calcCastleDisposition(sequence([6, 6]))).toEqual({
      key: 12,
      result: 'Enthusiastic',
    });
  });
});

describe('settlements.ts calcCastleEvent', () => {
  it('rolls the timing and nature when an event happens', () => {
    const event = calcCastleEvent(sequence([1, 3, 11]));

    expect(event.hasEvent).toBe(true);
    expect(event.whenEventHappens?.result).toBe('Is happening now');
    expect(event.eventNature?.result).toBe('Tournament');
  });

  it('returns no event details when the gate fails', () => {
    const event = calcCastleEvent(sequence([2]));

    expect(event.hasEvent).toBe(false);
    expect(event.whenEventHappens).toBeNull();
    expect(event.eventNature).toBeNull();
  });
});

describe('settlements.ts calcCastle', () => {
  it('generates a complete castle from the 2023 edition procedure', () => {
    const castle = calcCastle(
      sequence([
        9, 13,
        2,
        4, 2, 11, 10,
        3, 4, 2,
        5, 6,
        2, 2, 2, 2, 100,
        1, 5,
        5, 5, 4,
        1, 1,
        2,
      ])
    );

    expect(castle.name).toBe('Castle Dark Moor');
    expect(castle.condition.result).toBe('Worn');
    expect(castle.keep.shape.result).toBe('Round');
    expect(castle.keep.levels).toBe(3);
    expect(castle.keep.defensiveFeature.result).toBe('Iron spikes');
    expect(castle.keep.nonDefensiveFeature.result).toBe('Overgrown');
    expect(castle.keep.jails).toEqual({ commoners: 7, nobles: 2 });
    expect(castle.keep.suppliesMonths).toBe(11);
    expect(castle.keep.treasure.goldPieces).toBe(0);
    expect(castle.defense.structures.map((structure) => structure.result)).toEqual([
      'Motte (= mound)',
    ]);
    expect(castle.defense.towersAndWalls).toBeNull();
    expect(castle.defense.gatehouse).toBeNull();
    expect(castle.defense.moatEncounter).toBeNull();
    expect(castle.garrison.total).toBe(140);
    expect(castle.garrison.lord.level).toBe(11);
    expect(castle.garrison.lieutenant.level).toBe(9);
    expect(castle.garrison.bodyguards).toEqual({ count: 6, level: 6 });
    expect(castle.disposition.result).toBe('Attack on sight');
    expect(castle.event.hasEvent).toBe(false);
  });

  it('always produces a plausible castle for arbitrary rolls', () => {
    const castle = calcCastle(seeded(7));

    expect(castle.name.startsWith('Castle ')).toBe(true);
    expect(castle.keep.levels).toBeGreaterThanOrEqual(2);
    expect(castle.keep.levels).toBeLessThanOrEqual(4);
    expect(castle.defense.structures.length).toBeGreaterThanOrEqual(1);
    expect(castle.defense.structures.length).toBeLessThanOrEqual(4);
    expect(castle.garrison.total % 10).toBe(0);
    expect(castle.garrison.total).toBeGreaterThanOrEqual(30);
    expect(castle.garrison.total).toBeLessThanOrEqual(180);
    expect(
      castle.garrison.composition.reduce((sum, entry) => sum + entry.count, 0)
    ).toBe(castle.garrison.total);
    expect(castle.garrison.lord.level).toBeGreaterThanOrEqual(9);
  });
});

describe('settlements.ts tower tables', () => {
  it('uses 2d6 for the wizard level table', () => {
    expect(tableTowerWizardLevel.dice).toBe('2d6');
    expect(tableTowerWizardLevel.options[2]).toBe('7');
    expect(tableTowerWizardLevel.options[6]).toBe('9');
    expect(tableTowerWizardLevel.options[12]).toBe('11');
  });

  it('groups the aboveground and underground level counts', () => {
    expect(tableTowerAbovegroundLevels.options[1]).toBe('One');
    expect(tableTowerAbovegroundLevels.options[2]).toBe('Two');
    expect(tableTowerAbovegroundLevels.options[4]).toBe('Three');
    expect(tableTowerAbovegroundLevels.options[7]).toBe('Four');
    expect(tableTowerAbovegroundLevels.options[10]).toBe('Five');
    expect(tableTowerAbovegroundLevels.options[12]).toBe('Six');

    expect(tableTowerUndergroundLevels.options[1]).toBe('Zero');
    expect(tableTowerUndergroundLevels.options[6]).toBe('Zero');
    expect(tableTowerUndergroundLevels.options[7]).toBe('One');
    expect(tableTowerUndergroundLevels.options[9]).toBe('Two');
    expect(tableTowerUndergroundLevels.options[11]).toBe('Three');
    expect(tableTowerUndergroundLevels.options[12]).toBe('Four');
  });

  it('groups the level connections', () => {
    expect(tableTowerConnection.options[1]).toBe('Staircase');
    expect(tableTowerConnection.options[3]).toBe('Staircase');
    expect(tableTowerConnection.options[4]).toBe('Spiral staircase');
    expect(tableTowerConnection.options[6]).toBe('Spiral staircase');
    expect(tableTowerConnection.options[7]).toBe('Ladder');
    expect(tableTowerConnection.options[9]).toBe('Elevator');
    expect(tableTowerConnection.options[11]).toBe('Magic elevator');
    expect(tableTowerConnection.options[12]).toBe('Teleportation portals');
  });

  it('groups the details table', () => {
    expect(tableTowerDetails.options[1]).toBe('Nothing');
    expect(tableTowerDetails.options[10]).toBe('Nothing');
    expect(tableTowerDetails.options[11]).toBe('Balcony');
    expect(tableTowerDetails.options[13]).toBe('Battlements');
    expect(tableTowerDetails.options[20]).toBe('Turrets');
  });
});

describe('settlements.ts calcTowerWizard', () => {
  it('raises low wizard rolls to level 9', () => {
    expect(calcTowerWizard(sequence([1, 1, 2]))).toEqual({
      level: 9,
      apprentice: null,
    });
  });

  it('keeps higher wizard levels', () => {
    expect(calcTowerWizard(sequence([6, 6, 2]))).toEqual({
      level: 11,
      apprentice: null,
    });
  });

  it('adds an apprentice on a 25% chance', () => {
    expect(calcTowerWizard(sequence([3, 3, 1, 5]))).toEqual({
      level: 9,
      apprentice: { level: 5 },
    });
  });
});

describe('settlements.ts calcTower', () => {
  it('generates the tower from the 2023 edition example', () => {
    const tower = calcTower(
      sequence([
        3, 3,
        1, 2,
        4,
        7,
        1,
        17,
        6,
        1, 13,
        3,
        1,
        7,
        6, 8, 11,
        9,
        4,
        5,
      ])
    );

    expect(tower.wizard).toEqual({ level: 9, apprentice: { level: 2 } });
    expect(tower.levels).toEqual({
      aboveground: 3,
      underground: 1,
      total: 7,
    });
    expect(tower.connection.result).toBe('Staircase');
    expect(tower.outside.material.result).toBe('Limestone');
    expect(tower.outside.shape.result).toBe('Round');
    expect(tower.outside.details.map((detail) => detail.result)).toEqual([
      'Battlements',
    ]);
    expect(tower.insideAppearance.result).toBe('Dark');
    expect(tower.specialEquipment.result).toBe('Nothing');
    expect(tower.levelUsage.ground.result).toBe('Trapped room');
    expect(
      tower.levelUsage.aboveground.map((usage) => usage.result)
    ).toEqual(['Laboratory', 'Meeting room', 'Office/Study']);
    expect(tower.levelUsage.top.result).toBe('Lightning rod');
    expect(tower.levelUsage.underground.map((usage) => usage.result)).toEqual([
      'Chapel',
    ]);
    expect(tower.levelUsage.bottom?.result).toBe('Creature mouth');
  });

  it('handles a tower with no apprentice and no underground levels', () => {
    const tower = calcTower(
      sequence([
        3, 3,
        2,
        1,
        1,
        12,
        20,
        20,
        3, 1, 11, 20,
        10,
        20,
        1,
        1,
        1,
      ])
    );

    expect(tower.wizard).toEqual({ level: 9, apprentice: null });
    expect(tower.levels).toEqual({
      aboveground: 1,
      underground: 0,
      total: 3,
    });
    expect(tower.connection.result).toBe('Teleportation portals');
    expect(tower.outside.details.map((detail) => detail.result)).toEqual([
      'Balcony',
      'Turrets',
    ]);
    expect(tower.insideAppearance.result).toBe('Well decorated');
    expect(tower.specialEquipment.result).toBe('Ventilation system');
    expect(tower.levelUsage.ground.result).toBe('Empty and dusty');
    expect(
      tower.levelUsage.aboveground.map((usage) => usage.result)
    ).toEqual(['Abandoned/Cursed level']);
    expect(tower.levelUsage.top.result).toBe('Aviary');
    expect(tower.levelUsage.underground).toEqual([]);
    expect(tower.levelUsage.bottom).toBeNull();
  });

  it('always produces a plausible tower for arbitrary rolls', () => {
    const tower = calcTower(seeded(11));

    expect(tower.wizard.level).toBeGreaterThanOrEqual(9);
    expect(tower.wizard.level).toBeLessThanOrEqual(11);
    expect(tower.levels.aboveground).toBeGreaterThanOrEqual(1);
    expect(tower.levels.aboveground).toBeLessThanOrEqual(6);
    expect(tower.levels.underground).toBeGreaterThanOrEqual(0);
    expect(tower.levels.underground).toBeLessThanOrEqual(4);
    expect(tower.levels.total).toBe(
      2 +
        tower.levels.aboveground +
        tower.levels.underground +
        (tower.levels.underground > 0 ? 1 : 0)
    );
    expect(tower.levelUsage.aboveground.length).toBe(tower.levels.aboveground);
    expect(tower.levelUsage.underground.length).toBe(tower.levels.underground);
    expect(tower.levelUsage.bottom === null).toBe(
      tower.levels.underground === 0
    );
    expect(tower.outside.details.length).toBeLessThanOrEqual(3);
  });
});

describe('settlements.ts calcAbbeyName', () => {
  it('uses the fixed names', () => {
    expect(calcAbbeyName(sequence([1]))).toBe('Blessed-Land');
    expect(calcAbbeyName(sequence([5]))).toBe('Peaceful-Soul');
    expect(calcAbbeyName(sequence([6]))).toBe('Sacred-Heart');
  });

  it('fills in the Good- and Our-Lady-of- names', () => {
    expect(calcAbbeyName(sequence([4, 1]))).toBe('Good-Help');
    expect(calcAbbeyName(sequence([4, 2]))).toBe('Good-Hope');
    expect(calcAbbeyName(sequence([4, 3]))).toBe('Good-Relief');
    expect(calcAbbeyName(sequence([7, 1]))).toBe('Our-Lady-of-Chastity');
    expect(calcAbbeyName(sequence([7, 3]))).toBe('Our-Lady-of-the Poor');
  });

  it('fills in the Saint- names from the saint table', () => {
    expect(calcAbbeyName(sequence([8, 1]))).toBe('Saint-Adélie');
    expect(calcAbbeyName(sequence([9, 14]))).toBe('Saint-Geffrey');
    expect(calcAbbeyName(sequence([10, 30]))).toBe('Saint-Victor');
  });
});

describe('settlements.ts abbey tables', () => {
  it('groups the abbey sizes', () => {
    expect(tableAbbeySize.options[1]).toBe('Small');
    expect(tableAbbeySize.options[5]).toBe('Small');
    expect(tableAbbeySize.options[6]).toBe('Major');
  });

  it('treats 12-20 as a religious artifact', () => {
    expect(tableAbbeyFame.options[1]).toBe('Age');
    expect(tableAbbeyFame.options[11]).toBe('Quality of products');
    expect(tableAbbeyFame.options[12]).toBe('Religious artifact');
    expect(tableAbbeyFame.options[20]).toBe('Religious artifact');
  });

  it('groups the event timing', () => {
    expect(tableAbbeyEventWhen.options[1]).toBe('Ended earlier');
    expect(tableAbbeyEventWhen.options[2]).toBe('Is happening now');
    expect(tableAbbeyEventWhen.options[4]).toBe('Is happening now');
    expect(tableAbbeyEventWhen.options[5]).toBe('Will take place in the future');
    expect(tableAbbeyEventWhen.options[6]).toBe('Will take place in the future');
  });

  it('groups the relic spell levels', () => {
    expect(tableAbbeyRelicSpellLevel.options[1]).toBe('Level 1');
    expect(tableAbbeyRelicSpellLevel.options[8]).toBe('Level 1');
    expect(tableAbbeyRelicSpellLevel.options[9]).toBe('Level 2');
    expect(tableAbbeyRelicSpellLevel.options[14]).toBe('Level 2');
    expect(tableAbbeyRelicSpellLevel.options[15]).toBe('Level 3');
    expect(tableAbbeyRelicSpellLevel.options[17]).toBe('Level 3');
    expect(tableAbbeyRelicSpellLevel.options[18]).toBe('Level 4');
    expect(tableAbbeyRelicSpellLevel.options[19]).toBe('Level 4');
    expect(tableAbbeyRelicSpellLevel.options[20]).toBe('Level 5');
  });
});

describe('settlements.ts calcAbbeyFame', () => {
  it('returns null for a small abbey without rolling', () => {
    let rolls = 0;
    const fame = calcAbbeyFame('Small', (faces) => {
      rolls++;
      return Math.min(1, faces);
    });
    expect(fame).toBeNull();
    expect(rolls).toBe(0);
  });

  it('returns a non-artifact fame reason', () => {
    expect(calcAbbeyFame('Major', sequence([5]))).toEqual({
      fame: { key: 5, result: 'Domain and landscapes' },
      artifact: null,
    });
  });

  it('returns a non-relic artifact', () => {
    expect(calcAbbeyFame('Major', sequence([20, 4]))).toEqual({
      fame: { key: 20, result: 'Religious artifact' },
      artifact: {
        nature: { key: 4, result: 'Holy sword' },
        relic: null,
      },
    });
  });

  it('returns a relic with its saint and spell level', () => {
    expect(calcAbbeyFame('Major', sequence([12, 6, 9, 14, 1]))).toEqual({
      fame: { key: 12, result: 'Religious artifact' },
      artifact: {
        nature: { key: 6, result: 'Relic' },
        relic: {
          type: { key: 9, result: 'Leg' },
          saint: { key: 14, result: 'Geffrey' },
          spellLevel: { key: 1, result: 'Level 1' },
        },
      },
    });
  });
});

describe('settlements.ts calcAbbeyHistory', () => {
  it('leaves the founding date empty for other histories', () => {
    expect(calcAbbeyHistory(sequence([2]))).toEqual({
      history: { key: 2, result: 'Changed confession' },
      foundedYearsAgo: null,
    });
  });

  it('rolls 2d10 x10 years for a founded abbey', () => {
    expect(calcAbbeyHistory(sequence([5, 3, 4]))).toEqual({
      history: { key: 5, result: 'Founded 2d10 x10 years ago' },
      foundedYearsAgo: 70,
    });
  });
});

describe('settlements.ts calcAbbeyEvent', () => {
  it('produces no event on a roll other than 1', () => {
    expect(calcAbbeyEvent(sequence([2]))).toEqual({
      hasEvent: false,
      when: null,
      nature: null,
    });
  });

  it('produces an event with timing and nature on a 1', () => {
    expect(calcAbbeyEvent(sequence([1, 5, 10]))).toEqual({
      hasEvent: true,
      when: { key: 5, result: 'Will take place in the future' },
      nature: { key: 10, result: 'Plague' },
    });
  });
});

describe('settlements.ts calcAbbey', () => {
  it('generates the abbey from the 2023 edition example', () => {
    const abbey = calcAbbey(
      sequence([
        1,
        6,
        12,
        1, 2, 4, 2,
        5, 6,
        1,
        4,
        12, 6, 9, 14, 1,
        2,
        8,
      ])
    );

    expect(abbey.name).toBe('Blessed-Land');
    expect(abbey.size.result).toBe('Major');
    expect(abbey.monks).toBe(210);
    expect(abbey.abbot.level).toBe(11);
    expect(abbey.coreLocations.length).toBe(11);
    expect(abbey.coreLocations).toContain('Church');
    expect(abbey.additionalLocations.garden.result).toBe('Flower garden');
    expect(abbey.additionalLocations.infirmary.result).toBe('Drugstore');
    expect(abbey.additionalLocations.religiousBuildings.result).toBe(
      'Scriptorium and library'
    );
    expect(abbey.additionalLocations.other.result).toBe('Barns and stables');
    expect(abbey.activities.farming.map((entry) => entry.result)).toEqual([
      'Goats (meat, milk and cheese)',
      'Grapes (wine)',
    ]);
    expect(abbey.activities.workshop.result).toBe('Candle makers');
    expect(abbey.activities.other.result).toBe('Copy & translation');
    expect(abbey.fame?.fame.result).toBe('Religious artifact');
    expect(abbey.fame?.artifact?.nature.result).toBe('Relic');
    expect(abbey.fame?.artifact?.relic?.type.result).toBe('Leg');
    expect(abbey.fame?.artifact?.relic?.saint.result).toBe('Geffrey');
    expect(abbey.fame?.artifact?.relic?.spellLevel.result).toBe('Level 1');
    expect(abbey.event.hasEvent).toBe(false);
    expect(abbey.history.history.result).toBe('Sponsored by a rich patron');
    expect(abbey.history.foundedYearsAgo).toBeNull();
  });

  it('generates a small abbey with an event and a founding date', () => {
    const abbey = calcAbbey(
      sequence([
        2,
        1,
        4,
        1, 1, 1, 1,
        1, 2,
        2,
        2,
        1, 1, 12,
        5, 3, 4,
      ])
    );

    expect(abbey.name).toBe('Clear-Water');
    expect(abbey.size.result).toBe('Small');
    expect(abbey.monks).toBe(60);
    expect(abbey.abbot.level).toBe(10);
    expect(abbey.fame).toBeNull();
    expect(abbey.event.hasEvent).toBe(true);
    expect(abbey.event.when?.result).toBe('Ended earlier');
    expect(abbey.event.nature?.result).toBe('Visit of a notable person');
    expect(abbey.history.history.result).toBe('Founded 2d10 x10 years ago');
    expect(abbey.history.foundedYearsAgo).toBe(70);
  });

  it('keeps a small abbey abbot at level 9 below 50 monks', () => {
    const abbey = calcAbbey(
      sequence([3, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 2, 1])
    );

    expect(abbey.monks).toBe(40);
    expect(abbey.abbot.level).toBe(9);
  });

  it('always produces a plausible abbey for arbitrary rolls', () => {
    const abbey = calcAbbey(seeded(23));

    expect(abbey.name.length).toBeGreaterThan(0);
    expect(['Small', 'Major']).toContain(abbey.size.result);
    if (abbey.size.result === 'Small') {
      expect(abbey.monks).toBeGreaterThanOrEqual(30);
      expect(abbey.monks).toBeLessThanOrEqual(60);
      expect(abbey.fame).toBeNull();
    } else {
      expect(abbey.monks).toBeGreaterThanOrEqual(100);
      expect(abbey.monks).toBeLessThanOrEqual(330);
      expect(abbey.fame).not.toBeNull();
    }
    expect(abbey.abbot.level).toBeGreaterThanOrEqual(9);
    expect(abbey.coreLocations.length).toBe(11);
    expect(abbey.activities.farming.length).toBe(2);
    expect(
      new Set(abbey.activities.farming.map((entry) => entry.result)).size
    ).toBe(2);
    if (abbey.event.hasEvent) {
      expect(abbey.event.when).not.toBeNull();
      expect(abbey.event.nature).not.toBeNull();
    } else {
      expect(abbey.event.when).toBeNull();
      expect(abbey.event.nature).toBeNull();
    }
    if (abbey.history.foundedYearsAgo !== null) {
      expect(abbey.history.foundedYearsAgo % 10).toBe(0);
      expect(abbey.history.foundedYearsAgo).toBeGreaterThanOrEqual(20);
      expect(abbey.history.foundedYearsAgo).toBeLessThanOrEqual(200);
    }
  });
});
