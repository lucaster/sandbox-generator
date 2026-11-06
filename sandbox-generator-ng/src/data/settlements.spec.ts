import {
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
  calcVillage,
  tableCastleCondition,
  tableCastleDefensiveStructures,
  tableCastleDisposition,
  tableCityBuildingType,
  tableCitySize,
  tableHamletDisposition,
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
