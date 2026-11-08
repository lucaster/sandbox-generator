import {
  calcDragon,
  tableDragonAge,
  tableDragonAlignment,
  tableDragonBite,
  tableDragonBreath,
  tableDragonClaws,
  tableDragonFavoriteFood,
  tableDragonLair,
  tableDragonMorale,
  tableDragonName,
  tableDragonSavingThrows,
  tableDragonSize,
  tableDragonSpecialTreasure,
  tableDragonStatusDungeon,
  tableDragonStatusWilderness,
  tableDragonStrength,
  tableDragonTail,
  tableDragonWeakness,
} from './dragon';

function sequence(values: number[], fallback = 1) {
  let index = 0;
  return (faces: number) => Math.min(values[index++] ?? fallback, faces);
}

describe('dragon.ts tables', () => {
  it('uses the 2023 name, alignment, size, and age tables', () => {
    expect(tableDragonName.dice).toBe('1d12');
    expect(Object.values(tableDragonName.options)).toEqual([
      'Arkos',
      'Dalum',
      'Enoch',
      'Franil',
      'Irken',
      'Myriad',
      'Numin',
      'Ragor',
      'Sarhin',
      'Tychos',
      'Xerius',
      'Zéphyr',
    ]);

    expect(tableDragonAlignment.options).toEqual({
      1: 'Chaotic',
      2: 'Chaotic',
      3: 'Chaotic',
      4: 'Neutral',
      5: 'Neutral',
      6: 'Lawful',
    });

    expect(tableDragonSize.options).toEqual({
      1: 'Small',
      2: 'Small',
      3: 'Average',
      4: 'Average',
      5: 'Average',
      6: 'Average',
      7: 'Average',
      8: 'Huge',
    });

    expect(tableDragonAge.options).toEqual({
      1: 'Baby',
      2: 'Young',
      3: 'Young',
      4: 'Adult',
      5: 'Adult',
      6: 'Adult',
      7: 'Adult',
      8: 'Adult',
      9: 'Adult',
      10: 'Old',
      11: 'Old',
      12: 'Ancient',
    });
  });

  it('uses the 2023 breath, strength, and weakness tables', () => {
    expect(tableDragonBreath.options).toEqual({
      1: 'Acid (line)',
      2: 'Fire (cone)',
      3: 'Ice (cone)',
      4: 'Lightning (line)',
    });

    expect(tableDragonStrength.options).toEqual({
      1: 'Armor (+2 AC)',
      2: 'Bone plates (+1 AC)',
      3: 'Good nose',
      4: 'Lies detection',
      5: 'Persuasive voice',
      6: 'Poisonous claws (adds poison to claw attack)',
      7: 'Poisonous spines',
      8: 'Tail club (+1d6 damage to tail attack)',
      9: 'Two hearts',
      10: 'Underwater breathing',
    });

    expect(tableDragonWeakness.options).toEqual({
      1: 'Competitive mind',
      2: 'Cupidity',
      3: 'Curiosity',
      4: 'Flattery',
      5: 'Hurt scale (-1 AC)',
      6: 'Perforated wings (-2 AC)',
      7: 'Pride',
      8: 'Remorse',
      9: 'Self-confidence',
      10: 'Sunlight',
    });
  });

  it('uses the 2023 food, status, and lair tables', () => {
    expect(tableDragonFavoriteFood.options).toEqual({
      1: 'None',
      2: 'Adventurers',
      3: 'Cattle',
      4: 'Children',
      5: 'Humans',
      6: 'Nobles',
      7: 'Other monsters',
      8: 'Rare animals',
    });

    expect(tableDragonStatusWilderness.options).toEqual({
      1: 'Attacking someone',
      2: 'Carrying treasure',
      3: 'Flying',
      4: 'Hunted down',
      5: 'Hunting',
      6: 'Making a deal',
      7: 'Protecting its territory',
      8: 'Returning to its lair',
      9: 'Taking revenge',
      10: 'Terrorizing people',
    });

    expect(tableDragonStatusDungeon.options).toEqual({
      1: 'Aggressive',
      2: 'Chained',
      3: 'Defensive',
      4: 'Enraged',
      5: 'Hiding',
      6: 'Hurt',
      7: 'Neutral',
      8: 'Protecting its egg/baby',
      9: 'Retired',
      10: 'Sleeping',
    });

    expect(tableDragonLair.options).toEqual({
      1: 'Cave',
      2: 'Desecrated church',
      3: 'Giant nest',
      4: 'Giant tree',
      5: 'Mine',
      6: 'Overgrown tower',
      7: 'Rased village',
      8: 'Ruined castle',
      9: 'Tumulus',
      10: 'Volcano',
    });
  });

  it('uses the 2023 stat and attack tables', () => {
    expect(tableDragonSavingThrows.options).toEqual({
      1: 'Fighter: 10',
      2: 'Fighter: 10',
      3: 'Fighter: 10',
      4: 'Fighter: 11',
      5: 'Fighter: 11',
      6: 'Fighter: 12',
    });

    expect(tableDragonMorale.options).toEqual({
      1: '9',
      2: '9',
      3: '9',
      4: '10',
      5: '10',
      6: '11',
    });

    expect(tableDragonClaws.options).toEqual({
      1: '1d4',
      2: '1d4',
      3: '1d4',
      4: '1d4',
      5: '1d4',
      6: '1d4+1',
      7: '1d4+1',
      8: '1d4+1',
      9: '1d4+1',
      10: '1d4+1',
      11: '1d6',
      12: '1d6',
      13: '1d6',
      14: '1d6',
      15: '1d6+1',
      16: '1d6+1',
      17: '1d6+1',
      18: '1d8',
      19: '1d8',
      20: '2d8',
    });

    expect(tableDragonBite.options).toEqual({
      1: '2d8',
      2: '2d8',
      3: '2d8',
      4: '2d8',
      5: '2d8',
      6: '2d10',
      7: '2d10',
      8: '2d10',
      9: '2d10',
      10: '2d10',
      11: '3d8',
      12: '3d8',
      13: '3d8',
      14: '3d8',
      15: '3d10',
      16: '3d10',
      17: '3d10',
      18: '4d8',
      19: '4d8',
      20: '6d6',
    });

    expect(tableDragonTail.options).toEqual({
      1: '1d8',
      2: '1d8',
      3: '1d8',
      4: '1d8',
      5: '1d8',
      6: '1d10',
      7: '1d10',
      8: '1d10',
      9: '1d10',
      10: '1d10',
      11: '1d12',
      12: '1d12',
      13: '1d12',
      14: '1d12',
      15: '1d20',
      16: '1d20',
      17: '1d20',
      18: '2d8',
      19: '2d8',
      20: '3d6',
    });
  });

  it('uses the 2023 special treasure table', () => {
    expect(tableDragonSpecialTreasure.options).toEqual({
      1: 'Access to an special location',
      2: 'Ancient realm crown',
      3: 'Giant gem',
      4: 'Lost art piece',
      5: 'Prisoner',
      6: 'Rare book',
      7: 'Renowned magic item',
      8: 'Secret/Knowledge',
      9: '(Treasure) map',
      10: 'Unique weapon',
    });
  });
});

describe('dragon.ts calcDragon', () => {
  it('reproduces the book example (Numin)', () => {
    const dragon = calcDragon(
      'wilderness',
      sequence([
        7, // Numin
        1, // Chaotic
        3, // Average
        2, // Young
        1, // Acid (line)
        1, // Green
        1, // has a strength
        3, // Good nose
        1, // has a weakness
        8, // Remorse
        8, // Rare animals
        8, // Returning to its lair
        1, // Fighter: 10
        4, // morale 10
        11, // claws 1d6
        1, // bite 2d8
        20, // tail 3d6
        8, // Ruined castle
        1, // has a special treasure
        4, // Lost art piece
      ])
    );

    expect(dragon.name).toBe('Numin');
    expect(dragon.alignment).toBe('Chaotic');
    expect(dragon.size).toBe('Average');
    expect(dragon.age).toBe('Young');
    expect(dragon.breath).toBe('Acid (line)');
    expect(dragon.color).toBe('Green');
    expect(dragon.strength).toBe('Good nose');
    expect(dragon.weakness).toBe('Remorse');
    expect(dragon.favoriteFood).toBe('Rare animals');
    expect(dragon.status).toBe('Returning to its lair');
    expect(dragon.stats).toEqual({
      hitPoints: 18,
      armorClass: 18,
      savingThrows: 'Fighter: 10',
      morale: 10,
    });
    expect(dragon.attacks).toEqual({
      claws: '1d6',
      bite: '2d8',
      tail: '3d6',
      breathWeapon: 'See your favorite ruleset.',
    });
    expect(dragon.lair).toBe('Ruined castle');
    expect(dragon.specialTreasure).toBe('Lost art piece');
  });

  it('leaves strength, weakness, and special treasure null on a 2-6', () => {
    const dragon = calcDragon(
      'wilderness',
      sequence([1, 1, 8, 1, 1, 1, 2, 2, 1, 1, 1, 6, 1, 1, 1, 1, 2])
    );

    expect(dragon.strength).toBeNull();
    expect(dragon.weakness).toBeNull();
    expect(dragon.specialTreasure).toBeNull();
  });

  it('adds 1 morale to huge dragons', () => {
    const dragon = calcDragon(
      'wilderness',
      sequence([1, 1, 8, 1, 1, 1, 2, 2, 1, 1, 1, 6, 1, 1, 1, 1, 2])
    );

    expect(dragon.size).toBe('Huge');
    expect(dragon.stats.hitPoints).toBe(12);
    expect(dragon.stats.morale).toBe(12);
  });

  it('maps each breath and color to its armor class', () => {
    const colors: { [breath: number]: string[] } = {
      1: ['Green', 'Green', 'Green', 'Black', 'Black', 'Bronze'],
      2: ['Red', 'Red', 'Red', 'Brown', 'Brown', 'Copper'],
      3: ['Blue', 'Blue', 'Blue', 'White', 'White', 'Silver'],
      4: ['Yellow', 'Yellow', 'Yellow', 'Gray', 'Gray', 'Gold'],
    };
    const armorClass: { [color: string]: number } = {
      Green: 18,
      Red: 18,
      Blue: 18,
      Yellow: 18,
      Black: 20,
      Brown: 20,
      White: 20,
      Gray: 20,
      Bronze: 22,
      Copper: 22,
      Silver: 22,
      Gold: 22,
    };

    for (const breath of [1, 2, 3, 4]) {
      for (const colorRoll of [1, 2, 3, 4, 5, 6]) {
        const dragon = calcDragon(
          'wilderness',
          sequence([1, 1, 1, 1, breath, colorRoll], 2)
        );
        const color = colors[breath][colorRoll - 1];

        expect(dragon.color).toBe(color);
        expect(dragon.stats.armorClass).toBe(armorClass[color]);
      }
    }
  });

  it('uses the dungeon status table when asked for a dungeon', () => {
    const wilderness = calcDragon(
      'wilderness',
      sequence([1, 1, 1, 1, 1, 1, 2, 2, 1, 10], 2)
    );
    const dungeon = calcDragon(
      'dungeon',
      sequence([1, 1, 1, 1, 1, 1, 2, 2, 1, 10], 2)
    );

    expect(wilderness.status).toBe('Terrorizing people');
    expect(dungeon.status).toBe('Sleeping');
  });
});
