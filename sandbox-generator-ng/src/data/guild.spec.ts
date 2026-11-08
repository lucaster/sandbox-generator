import {
  calcGuild,
  guildRandomTables,
  tableGuildEventsAdventuring,
  tableGuildEventsCrafts,
  tableGuildEventsHobbies,
  tableGuildEventsMagic,
  tableGuildEventsMerchants,
  tableGuildEventsResources,
  tableGuildEventsSciences,
  tableGuildEventsSpectacle,
  tableGuildField,
  tableGuildFieldAdventuring,
  tableGuildFieldCrafts,
  tableGuildFieldHobbies,
  tableGuildFieldMagic,
  tableGuildFieldMerchants,
  tableGuildFieldResources,
  tableGuildFieldSciences,
  tableGuildFieldSpectacle,
  tableGuildProblemsAdventuring,
  tableGuildProblemsCrafts,
  tableGuildProblemsHobbies,
  tableGuildProblemsMagic,
  tableGuildProblemsMerchants,
  tableGuildProblemsResources,
  tableGuildProblemsSciences,
  tableGuildProblemsSpectacle,
} from './guild';

describe('guild tables', () => {
  it('models the 2023 field and expertise subtables', () => {
    expect(tableGuildField.options).toEqual({
      1: 'Adventuring',
      2: 'Crafts',
      3: 'Hobbies',
      4: 'Magic',
      5: 'Merchants',
      6: 'Resources',
      7: 'Sciences',
      8: 'Spectacle',
    });
    expect([
      tableGuildFieldAdventuring,
      tableGuildFieldCrafts,
      tableGuildFieldHobbies,
      tableGuildFieldMagic,
      tableGuildFieldMerchants,
      tableGuildFieldResources,
      tableGuildFieldSciences,
      tableGuildFieldSpectacle,
    ].map((table) => Object.keys(table.options).length)).toEqual(Array(8).fill(6));
  });

  it('uses explicit, unique tables in the order they appear in the book', () => {
    const ids = guildRandomTables.map((table) => table.id);
    expect(new Set(ids).size).toBe(guildRandomTables.length);
    expect(ids).toEqual(Array.from({ length: 37 }, (_, index) => 290 + index));

    for (const table of guildRandomTables) {
      const keys = Object.keys(table.options).map(Number).sort((a, b) => a - b);
      if (table.dice) {
        const [count, faces] = table.dice.split('d').map(Number);
        expect(keys).withContext(table.title).toEqual(
          Array.from({ length: count * faces - count + 1 }, (_, index) => count + index),
        );
      } else {
        expect(keys.every((key) => key === 1 || key === 2 || key === 3 || key === 4 || key === 5 || key === 6))
          .withContext(table.title)
          .toBeTrue();
      }
      expect(Object.values(table.options).every((result) => typeof result === 'string'))
        .withContext(table.title)
        .toBeTrue();
    }

    expect(guildRandomTables.filter((table) => !table.dice).map((table) => Object.keys(table.options).map(Number)))
      .toEqual([
        [1, 2, 3, 4],
        [5, 6], [5, 6], [5, 6], [5, 6], [5, 6], [5, 6], [5, 6], [5, 6],
        [1, 2, 3, 4],
        [5, 6], [5, 6], [5, 6], [5, 6], [5, 6], [5, 6], [5, 6], [5, 6],
      ]);
  });

  it('includes all field-specific event and problem entries', () => {
    const fieldEventTables = [
      tableGuildEventsAdventuring,
      tableGuildEventsCrafts,
      tableGuildEventsHobbies,
      tableGuildEventsMagic,
      tableGuildEventsMerchants,
      tableGuildEventsResources,
      tableGuildEventsSciences,
      tableGuildEventsSpectacle,
    ];
    const fieldProblemTables = [
      tableGuildProblemsAdventuring,
      tableGuildProblemsCrafts,
      tableGuildProblemsHobbies,
      tableGuildProblemsMagic,
      tableGuildProblemsMerchants,
      tableGuildProblemsResources,
      tableGuildProblemsSciences,
      tableGuildProblemsSpectacle,
    ];

    for (const table of [...fieldEventTables, ...fieldProblemTables]) {
      expect(Object.keys(table.options).map(Number)).withContext(table.title).toEqual([5, 6]);
    }
    expect(tableGuildEventsMagic.options).toEqual({
      5: 'Magic congress',
      6: 'Spellcasting contest',
    });
    expect(tableGuildProblemsSciences.options).toEqual({
      5: 'Failed experiment',
      6: 'Library fire',
    });
  });
});

describe('calcGuild', () => {
  it('rolls field, expertise, name, power, members, event, and problem in book order', () => {
    const calls: number[] = [];
    const guild = calcGuild({
      rollFn: (faces) => {
        calls.push(faces);
        return faces;
      },
    });

    expect(calls).toEqual([8, 6, 12, 12, 12, 12, 6, 12, 8, 20, 20, 20, 6, 6]);
    expect(guild.field).toEqual({ roll: 8, result: 'Spectacle' });
    expect(guild.fieldSpecialty).toEqual({ roll: 6, result: 'Singing' });
    expect(guild.expertise).toEqual({ roll: 12, result: 'Master' });
    expect(guild.name).toEqual({
      roll: 12,
      template: 'The Friendly ...',
      fieldName: 'Singing',
      result: 'The Friendly Singing',
    });
    expect(guild.power.motivation.result).toBe('Charity');
    expect(guild.members.appearance.result).toBe('Work injury');
    expect(guild.event).toEqual({
      roll: 6,
      result: 'Tour across the country',
      source: 'field-specific',
    });
    expect(guild.problem).toEqual({
      roll: 6,
      result: 'Stolen designs/script/text',
      source: 'field-specific',
    });
  });

  it('uses common events and problems on rolls 1–4', () => {
    const guild = calcGuild({ rollFn: () => 1 });
    expect(guild.event).toEqual({
      roll: 1,
      result: 'Demonstration/Strike',
      source: 'common',
    });
    expect(guild.problem).toEqual({
      roll: 1,
      result: 'Bankruptcy',
      source: 'common',
    });
  });

  it('accepts a fitting phrase for the name template', () => {
    const guild = calcGuild({
      nameField: 'Demon Study',
      rollFn: (faces) => faces === 8 ? 4 : faces === 12 ? 6 : 3,
    });
    expect(guild.field.result).toBe('Magic');
    expect(guild.fieldSpecialty.result).toBe('Demonology');
    expect(guild.expertise.result).toBe('Expert');
    expect(guild.name).toEqual({
      roll: 6,
      template: 'The Sisters/Brothers of ...',
      fieldName: 'Demon Study',
      result: 'The Sisters/Brothers of Demon Study',
    });
  });
});
