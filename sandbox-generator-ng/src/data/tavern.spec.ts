import { calcTavern, rollTavernDrink, tavernRandomTables } from './tavern';

describe('Tavern tables', () => {
  it('defines each 2023 table with complete, unique roll coverage', () => {
    const ids = tavernRandomTables.map((table) => table.id);
    expect(new Set(ids).size).toBe(tavernRandomTables.length);
    expect(ids).toEqual(Array.from({ length: 44 }, (_, index) => 327 + index));

    for (const table of tavernRandomTables) {
      const faces = Number(table.dice?.split('d')[1]);
      const keys = Object.keys(table.options).map(Number).sort((a, b) => a - b);
      expect(keys).withContext(table.title).toEqual(
        Array.from({ length: faces }, (_, index) => index + 1),
      );
      expect(Object.values(table.options).every((result) => typeof result === 'string'))
        .withContext(table.title)
        .toBeTrue();
    }
  });
});

describe('calcTavern', () => {
  it('generates the complete tavern and follows conditional table rolls', () => {
    const tavern = calcTavern({ rollFn: () => 1 });

    expect(tavern.name.result).toBe('Adventurer(s) Bar(maid)');
    expect(tavern.decorations).toEqual([{ roll: 1, result: 'Birdhouses' }]);
    expect(tavern.servers.commonTrait).toEqual({
      roll: 1,
      result: 'Also work as dancers',
    });
    expect(tavern.rooms.special).toEqual({ roll: 1, result: 'Badly decorated' });
    expect(tavern.menu.specialsOfTheDay.mainDish.result).toBe('Boiled crab');
    expect(tavern.menu.travelersMeal.snack.result).toBe('Cheese & meat platter');
    expect(tavern.menu.fullCourseMenu.appetizer.result).toBe('Beans casserole');
    expect(tavern.rumor.truthfulness.result).toBe('True');
    expect(tavern.sign.subPanel.result).toBe('No sub-panel');
    expect(tavern.sign.specialFeature.result).toBe('Nothing special');
  });

  it('rolls optional and nested results when those options are selected', () => {
    const tavern = calcTavern({
      includeSecondServerTrait: true,
      rollFn: (faces) => faces,
    });

    expect(tavern.servers.secondIndividualTrait).toEqual({
      roll: 20,
      result: 'Worrying',
    });
    expect(tavern.menu.specialsOfTheDay.mainDish).toEqual({
      roll: 20,
      result: 'Vol-au-vent',
      detail: null,
      serving: 'Served with fried potatoes or mashed potatoes, and salad.',
    });
    expect(tavern.menu.fullCourseMenu.appetizer).toEqual({
      roll: 6,
      result: 'Verrine',
      detail: { roll: 3, result: 'Vegetables' },
      serving: null,
    });
    expect(tavern.sign.illustration).toBeNull();
  });

  it('returns a separately requested drink and specializes wine', () => {
    expect(rollTavernDrink(() => 10)).toEqual({
      roll: 10,
      result: 'Wine',
      wine: { roll: 4, result: 'White' },
    });
    expect(rollTavernDrink(() => 1)).toEqual({ roll: 1, result: 'Beer', wine: null });
  });
});
