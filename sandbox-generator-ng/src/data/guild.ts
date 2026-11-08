import { d } from '../dice/dice';
import { type RandomTable } from '../domain/random-table';
import { randomOptionEntry } from './data';

type GuildField =
  | 'Adventuring'
  | 'Crafts'
  | 'Hobbies'
  | 'Magic'
  | 'Merchants'
  | 'Resources'
  | 'Sciences'
  | 'Spectacle';

type GuildTableResult = {
  roll: number;
  result: string;
};

type GuildConditionalResult = GuildTableResult & {
  source: 'common' | 'field-specific';
};

type Guild = {
  field: GuildTableResult;
  fieldSpecialty: GuildTableResult;
  expertise: GuildTableResult;
  name: GuildTableResult & { template: string; fieldName: string };
  power: {
    renown: GuildTableResult;
    resources: GuildTableResult;
    guildhouses: GuildTableResult;
    specialAsset: GuildTableResult;
    motivation: GuildTableResult;
  };
  members: {
    initiation: GuildTableResult;
    appearance: GuildTableResult;
    quirk: GuildTableResult;
  };
  event: GuildConditionalResult;
  problem: GuildConditionalResult;
};

// Book: Generators > Guild > 1) Field, p. 125.
const tableGuildField: RandomTable = {
  id: 290,
  title: 'Guild Field',
  dice: '1d8',
  options: {
    1: 'Adventuring',
    2: 'Crafts',
    3: 'Hobbies',
    4: 'Magic',
    5: 'Merchants',
    6: 'Resources',
    7: 'Sciences',
    8: 'Spectacle',
  },
};

// Book: Generators > Guild > 1) Field > Adventuring, p. 125.
const tableGuildFieldAdventuring: RandomTable = {
  id: 291,
  title: 'Guild Field: Adventuring',
  dice: '1d6',
  options: {
    1: 'Bounty hunting',
    2: 'Mercenaries',
    3: 'Monster hunting',
    4: 'Investigation',
    5: 'Scavenging',
    6: 'Scouting',
  },
};

// Book: Generators > Guild > 1) Field > Crafts, p. 125.
const tableGuildFieldCrafts: RandomTable = {
  id: 292,
  title: 'Guild Field: Crafts',
  dice: '1d6',
  options: {
    1: 'Blacksmithing',
    2: 'Building',
    3: 'Knife making',
    4: 'Shoemaking',
    5: 'Tailoring',
    6: 'Tanning',
  },
};

// Book: Generators > Guild > 1) Field > Hobbies, p. 125.
const tableGuildFieldHobbies: RandomTable = {
  id: 293,
  title: 'Guild Field: Hobbies',
  dice: '1d6',
  options: {
    1: 'Books',
    2: 'Cooking',
    3: 'Fishing',
    4: 'Gardening',
    5: 'Painting',
    6: 'Pottery',
  },
};

// Book: Generators > Guild > 1) Field > Magic, p. 125.
const tableGuildFieldMagic: RandomTable = {
  id: 294,
  title: 'Guild Field: Magic',
  dice: '1d6',
  options: {
    1: 'Alchemy',
    2: 'Astrology',
    3: 'Demonology',
    4: 'Divination',
    5: 'Enchanting',
    6: 'Spells',
  },
};

// Book: Generators > Guild > 1) Field > Merchants, p. 125.
const tableGuildFieldMerchants: RandomTable = {
  id: 295,
  title: 'Guild Field: Merchants',
  dice: '1d6',
  options: {
    1: 'Baking',
    2: 'Brewing/Winemaking',
    3: 'Butchery',
    4: 'Cheese',
    5: 'Distant lands trading',
    6: 'Fruits/Vegetables',
  },
};

// Book: Generators > Guild > 1) Field > Resources, p. 125.
const tableGuildFieldResources: RandomTable = {
  id: 296,
  title: 'Guild Field: Resources',
  dice: '1d6',
  options: {
    1: 'Farming',
    2: 'Hunting',
    3: 'Mining',
    4: 'Mushrooms cultivation',
    5: 'Stonecutting',
    6: 'Woodcutting',
  },
};

// Book: Generators > Guild > 1) Field > Sciences, p. 125.
const tableGuildFieldSciences: RandomTable = {
  id: 297,
  title: 'Guild Field: Sciences',
  dice: '1d6',
  options: {
    1: 'Astronomy',
    2: 'Botany',
    3: 'Engineering',
    4: 'Entomology',
    5: 'Geography',
    6: 'Philosophy',
  },
};

// Book: Generators > Guild > 1) Field > Spectacle, p. 125.
const tableGuildFieldSpectacle: RandomTable = {
  id: 298,
  title: 'Guild Field: Spectacle',
  dice: '1d6',
  options: {
    1: 'Acting',
    2: 'Dancing',
    3: 'Fashion',
    4: 'Music',
    5: 'Poetry',
    6: 'Singing',
  },
};

const tableGuildFields: Record<GuildField, RandomTable> = {
  Adventuring: tableGuildFieldAdventuring,
  Crafts: tableGuildFieldCrafts,
  Hobbies: tableGuildFieldHobbies,
  Magic: tableGuildFieldMagic,
  Merchants: tableGuildFieldMerchants,
  Resources: tableGuildFieldResources,
  Sciences: tableGuildFieldSciences,
  Spectacle: tableGuildFieldSpectacle,
};

// Book: Generators > Guild > 2) Expertise, p. 126.
const tableGuildExpertise: RandomTable = {
  id: 299,
  title: 'Guild Expertise',
  dice: '1d12',
  options: {
    1: 'None',
    2: 'Basic',
    3: 'Basic',
    4: 'Basic',
    5: 'Expert',
    6: 'Expert',
    7: 'Expert',
    8: 'Expert',
    9: 'Companion',
    10: 'Companion',
    11: 'Companion',
    12: 'Master',
  },
};

// Book: Generators > Guild > 3) Name, p. 126.
const tableGuildName: RandomTable = {
  id: 300,
  title: 'Guild Name Structure',
  dice: '1d12',
  options: {
    1: "The ... ('s) Guild",
    2: "The ... ('s) Guild",
    3: "The ... ('s) Guild",
    4: "The ... ('s) Guild",
    5: "The ... ('s) Guild",
    6: 'The Sisters/Brothers of ...',
    7: "The ... ('s) Circle",
    8: "The ... ('s) Club",
    9: 'The ... Enthusiasts',
    10: 'The ... Lovers',
    11: 'The ... Society',
    12: 'The Friendly ...',
  },
};

// Book: Generators > Guild > 4) Power > Renown, p. 126.
const tableGuildRenown: RandomTable = {
  id: 301,
  title: 'Guild Renown',
  dice: '1d12',
  options: {
    1: 'Secret',
    2: 'Unknown',
    3: 'Unknown',
    4: 'Unknown',
    5: 'Known',
    6: 'Known',
    7: 'Known',
    8: 'Known',
    9: 'Famous',
    10: 'Famous',
    11: 'Famous',
    12: 'Known everywhere',
  },
};

// Book: Generators > Guild > 4) Power > Resources, p. 126.
const tableGuildResources: RandomTable = {
  id: 302,
  title: 'Guild Resources',
  dice: '1d12',
  options: {
    1: 'None',
    2: 'Low',
    3: 'Low',
    4: 'Low',
    5: 'Average',
    6: 'Average',
    7: 'Average',
    8: 'Average',
    9: 'High',
    10: 'High',
    11: 'High',
    12: 'Infinite',
  },
};

// Book: Generators > Guild > 4) Power > Guildhouses, p. 126.
const tableGuildGuildhouses: RandomTable = {
  id: 303,
  title: 'Guild Guildhouses',
  dice: '1d6',
  options: {
    1: 'A few ones',
    2: 'A few ones',
    3: 'A lot',
    4: 'A lot',
    5: 'Only one building',
    6: 'Ubiquitous',
  },
};

// Book: Generators > Guild > 4) Power > Special asset, p. 126.
const tableGuildSpecialAsset: RandomTable = {
  id: 304,
  title: 'Guild Special Asset',
  dice: '1d12',
  options: {
    1: 'None',
    2: 'None',
    3: 'None',
    4: 'None',
    5: 'None',
    6: 'None',
    7: 'Ancient knowledge',
    8: 'Blessing',
    9: 'High-level contacts',
    10: 'Patrons',
    11: 'Prisoner',
    12: 'Relic',
  },
};

// Book: Generators > Guild > 4) Power > Motivation, p. 126.
const tableGuildMotivation: RandomTable = {
  id: 305,
  title: 'Guild Motivation',
  dice: '1d8',
  options: {
    1: 'Wealth',
    2: 'Wealth',
    3: 'Wealth',
    4: 'Renown',
    5: 'Renown',
    6: 'Power',
    7: 'Power',
    8: 'Charity',
  },
};

// Book: Generators > Guild > 5) Members > Initiation, p. 127.
const tableGuildInitiation: RandomTable = {
  id: 306,
  title: 'Guild Initiation',
  dice: '1d20',
  options: {
    1: 'No initiation',
    2: 'No initiation',
    3: 'No initiation',
    4: 'No initiation',
    5: 'No initiation',
    6: 'Alcohol',
    7: 'Alcohol',
    8: 'Alcohol',
    9: 'Alcohol',
    10: 'Alcohol',
    11: 'Braving a taboo',
    12: 'Braving a taboo',
    13: 'Giving up their past life',
    14: 'Giving up their past life',
    15: 'Humiliation',
    16: 'Mutilation',
    17: 'Scary ceremony',
    18: 'Sport',
    19: 'Taking an oath',
    20: 'Trials',
  },
};

// Book: Generators > Guild > 5) Members > Appearance, p. 127.
const tableGuildAppearance: RandomTable = {
  id: 307,
  title: 'Guild Member Appearance',
  dice: '1d20',
  options: {
    1: 'None',
    2: 'None',
    3: 'None',
    4: 'None',
    5: 'None',
    6: 'None',
    7: 'None',
    8: 'None',
    9: 'None',
    10: 'None',
    11: 'Animal traits',
    12: 'Distinctive tattoo',
    13: 'Item related to their field',
    14: 'Jewelry',
    15: 'Mutation',
    16: 'Mutilation',
    17: 'Particular hairstyle',
    18: 'Specific makeup',
    19: 'Uniform',
    20: 'Work injury',
  },
};

// Book: Generators > Guild > 5) Members > Quirk, p. 127.
const tableGuildQuirk: RandomTable = {
  id: 308,
  title: 'Guild Member Quirk',
  dice: '1d20',
  options: {
    1: 'None',
    2: 'None',
    3: 'None',
    4: 'None',
    5: 'None',
    6: 'None',
    7: 'None',
    8: 'None',
    9: 'None',
    10: 'None',
    11: 'Always seem angry/happy',
    12: 'Extremely paranoid',
    13: 'Hide something',
    14: 'Inexplicably old',
    15: 'Make puns related to their field',
    16: 'Never speak',
    17: 'Never stop trying to recruit',
    18: 'Passionate about their field',
    19: 'Travel in processions',
    20: 'Worship their craft',
  },
};

// Book: Generators > Guild > 6) Events > Common, p. 128.
const tableGuildCommonEvents: RandomTable = {
  id: 309,
  title: 'Guild Common Events',
  options: {
    1: 'Demonstration/Strike',
    2: 'Open-house',
    3: 'Procession',
    4: 'Recruiting',
  },
};

// Book: Generators > Guild > 6) Events > Adventuring, p. 128.
const tableGuildEventsAdventuring: RandomTable = {
  id: 310,
  title: 'Guild Events: Adventuring',
  options: { 5: 'Show off', 6: 'Trophy/Medal showcase' },
};

// Book: Generators > Guild > 6) Events > Crafts, p. 128.
const tableGuildEventsCrafts: RandomTable = {
  id: 311,
  title: 'Guild Events: Crafts',
  options: { 5: 'Crafting contest', 6: 'Traveling market' },
};

// Book: Generators > Guild > 6) Events > Hobbies, p. 128.
const tableGuildEventsHobbies: RandomTable = {
  id: 312,
  title: 'Guild Events: Hobbies',
  options: { 5: 'Ball', 6: 'Exhibition' },
};

// Book: Generators > Guild > 6) Events > Magic, p. 128.
const tableGuildEventsMagic: RandomTable = {
  id: 313,
  title: 'Guild Events: Magic',
  options: { 5: 'Magic congress', 6: 'Spellcasting contest' },
};

// Book: Generators > Guild > 6) Events > Merchants, p. 128.
const tableGuildEventsMerchants: RandomTable = {
  id: 314,
  title: 'Guild Events: Merchants',
  options: { 5: 'Big sale', 6: 'Market' },
};

// Book: Generators > Guild > 6) Events > Resources, p. 128.
const tableGuildEventsResources: RandomTable = {
  id: 315,
  title: 'Guild Events: Resources',
  options: { 5: 'Festival', 6: 'Technical seminar' },
};

// Book: Generators > Guild > 6) Events > Sciences, p. 128.
const tableGuildEventsSciences: RandomTable = {
  id: 316,
  title: 'Guild Events: Sciences',
  options: { 5: 'Congress', 6: 'New discoveries fair' },
};

// Book: Generators > Guild > 6) Events > Spectacle, p. 128.
const tableGuildEventsSpectacle: RandomTable = {
  id: 317,
  title: 'Guild Events: Spectacle',
  options: { 5: 'Performance', 6: 'Tour across the country' },
};

const tableGuildEventsByField: Record<GuildField, RandomTable> = {
  Adventuring: tableGuildEventsAdventuring,
  Crafts: tableGuildEventsCrafts,
  Hobbies: tableGuildEventsHobbies,
  Magic: tableGuildEventsMagic,
  Merchants: tableGuildEventsMerchants,
  Resources: tableGuildEventsResources,
  Sciences: tableGuildEventsSciences,
  Spectacle: tableGuildEventsSpectacle,
};

// Book: Generators > Guild > 7) Problems > Common, p. 128.
const tableGuildCommonProblems: RandomTable = {
  id: 318,
  title: 'Guild Common Problems',
  options: {
    1: 'Bankruptcy',
    2: 'Members leaving',
    3: 'New law hindering the guild',
    4: 'New rival guild',
  },
};

// Book: Generators > Guild > 7) Problems > Adventuring, p. 128.
const tableGuildProblemsAdventuring: RandomTable = {
  id: 319,
  title: 'Guild Problems: Adventuring',
  options: { 5: 'Death of a guild member', 6: 'Treason' },
};

// Book: Generators > Guild > 7) Problems > Crafts, p. 128.
const tableGuildProblemsCrafts: RandomTable = {
  id: 320,
  title: 'Guild Problems: Crafts',
  options: { 5: 'Scarcity of raw materials', 6: 'Work accident' },
};

// Book: Generators > Guild > 7) Problems > Hobbies, p. 128.
const tableGuildProblemsHobbies: RandomTable = {
  id: 321,
  title: 'Guild Problems: Hobbies',
  options: { 5: 'Loss of interest', 6: 'Theft' },
};

// Book: Generators > Guild > 7) Problems > Magic, p. 128.
const tableGuildProblemsMagic: RandomTable = {
  id: 322,
  title: 'Guild Problems: Magic',
  options: { 5: 'Magic has a bad reputation', 6: 'Spell gone wrong' },
};

// Book: Generators > Guild > 7) Problems > Merchants, p. 128.
const tableGuildProblemsMerchants: RandomTable = {
  id: 323,
  title: 'Guild Problems: Merchants',
  options: { 5: 'Bad season', 6: 'Pests invasion' },
};

// Book: Generators > Guild > 7) Problems > Resources, p. 128.
const tableGuildProblemsResources: RandomTable = {
  id: 324,
  title: 'Guild Problems: Resources',
  options: { 5: 'Prices raise', 6: 'Weather related incident' },
};

// Book: Generators > Guild > 7) Problems > Sciences, p. 128.
const tableGuildProblemsSciences: RandomTable = {
  id: 325,
  title: 'Guild Problems: Sciences',
  options: { 5: 'Failed experiment', 6: 'Library fire' },
};

// Book: Generators > Guild > 7) Problems > Spectacle, p. 128.
const tableGuildProblemsSpectacle: RandomTable = {
  id: 326,
  title: 'Guild Problems: Spectacle',
  options: { 5: 'Sick lead', 6: 'Stolen designs/script/text' },
};

const tableGuildProblemsByField: Record<GuildField, RandomTable> = {
  Adventuring: tableGuildProblemsAdventuring,
  Crafts: tableGuildProblemsCrafts,
  Hobbies: tableGuildProblemsHobbies,
  Magic: tableGuildProblemsMagic,
  Merchants: tableGuildProblemsMerchants,
  Resources: tableGuildProblemsResources,
  Sciences: tableGuildProblemsSciences,
  Spectacle: tableGuildProblemsSpectacle,
};

const guildRandomTables: RandomTable[] = [
  tableGuildField,
  tableGuildFieldAdventuring,
  tableGuildFieldCrafts,
  tableGuildFieldHobbies,
  tableGuildFieldMagic,
  tableGuildFieldMerchants,
  tableGuildFieldResources,
  tableGuildFieldSciences,
  tableGuildFieldSpectacle,
  tableGuildExpertise,
  tableGuildName,
  tableGuildRenown,
  tableGuildResources,
  tableGuildGuildhouses,
  tableGuildSpecialAsset,
  tableGuildMotivation,
  tableGuildInitiation,
  tableGuildAppearance,
  tableGuildQuirk,
  tableGuildCommonEvents,
  tableGuildEventsAdventuring,
  tableGuildEventsCrafts,
  tableGuildEventsHobbies,
  tableGuildEventsMagic,
  tableGuildEventsMerchants,
  tableGuildEventsResources,
  tableGuildEventsSciences,
  tableGuildEventsSpectacle,
  tableGuildCommonProblems,
  tableGuildProblemsAdventuring,
  tableGuildProblemsCrafts,
  tableGuildProblemsHobbies,
  tableGuildProblemsMagic,
  tableGuildProblemsMerchants,
  tableGuildProblemsResources,
  tableGuildProblemsSciences,
  tableGuildProblemsSpectacle,
];

function rollEntry(
  table: RandomTable,
  rollFn: (faces: number) => number,
): GuildTableResult {
  const entry = randomOptionEntry(table, rollFn);
  return { roll: entry.key, result: entry.result };
}

function rollConditionalResult(
  rollFn: (faces: number) => number,
  fieldTables: Record<GuildField, RandomTable>,
  commonTable: RandomTable,
  field: GuildField,
): GuildConditionalResult {
  const roll = Math.min(Math.max(rollFn(6), 1), 6);
  const source = roll <= 4 ? 'common' : 'field-specific';
  const table = source === 'common' ? commonTable : fieldTables[field];
  const result = table.options[roll];
  if (typeof result !== 'string') {
    throw new RangeError(`No guild result is defined for ${table.title}, roll ${roll}.`);
  }
  return { roll, result, source };
}

function isGuildField(value: string): value is GuildField {
  return Object.prototype.hasOwnProperty.call(tableGuildFields, value);
}

function calcGuild(
  options: {
    nameField?: string;
    rollFn?: (faces: number) => number;
  } = {},
): Guild {
  const rollFn = options.rollFn ?? d;
  const field = rollEntry(tableGuildField, rollFn);
  if (!isGuildField(field.result)) {
    throw new Error(`Unknown guild field "${field.result}".`);
  }
  const guildField = field.result;
  const fieldSpecialty = rollEntry(tableGuildFields[guildField], rollFn);
  const expertise = rollEntry(tableGuildExpertise, rollFn);
  const nameEntry = rollEntry(tableGuildName, rollFn);
  const nameField = options.nameField?.trim() || fieldSpecialty.result;
  const name = nameEntry.result.replaceAll('...', nameField);
  const renown = rollEntry(tableGuildRenown, rollFn);
  const resources = rollEntry(tableGuildResources, rollFn);
  const guildhouses = rollEntry(tableGuildGuildhouses, rollFn);
  const specialAsset = rollEntry(tableGuildSpecialAsset, rollFn);
  const motivation = rollEntry(tableGuildMotivation, rollFn);
  const initiation = rollEntry(tableGuildInitiation, rollFn);
  const appearance = rollEntry(tableGuildAppearance, rollFn);
  const quirk = rollEntry(tableGuildQuirk, rollFn);
  const event = rollConditionalResult(
    rollFn,
    tableGuildEventsByField,
    tableGuildCommonEvents,
    guildField,
  );
  const problem = rollConditionalResult(
    rollFn,
    tableGuildProblemsByField,
    tableGuildCommonProblems,
    guildField,
  );

  return {
    field,
    fieldSpecialty,
    expertise,
    name: {
      roll: nameEntry.roll,
      template: nameEntry.result,
      fieldName: nameField,
      result: name,
    },
    power: { renown, resources, guildhouses, specialAsset, motivation },
    members: { initiation, appearance, quirk },
    event,
    problem,
  };
}

export {
  calcGuild,
  guildRandomTables,
  tableGuildAppearance,
  tableGuildCommonEvents,
  tableGuildCommonProblems,
  tableGuildEventsAdventuring,
  tableGuildEventsCrafts,
  tableGuildEventsHobbies,
  tableGuildEventsMagic,
  tableGuildEventsMerchants,
  tableGuildEventsResources,
  tableGuildEventsSciences,
  tableGuildEventsSpectacle,
  tableGuildExpertise,
  tableGuildField,
  tableGuildFieldAdventuring,
  tableGuildFieldCrafts,
  tableGuildFieldHobbies,
  tableGuildFieldMagic,
  tableGuildFieldMerchants,
  tableGuildFieldResources,
  tableGuildFieldSciences,
  tableGuildFieldSpectacle,
  tableGuildGuildhouses,
  tableGuildInitiation,
  tableGuildMotivation,
  tableGuildName,
  tableGuildProblemsAdventuring,
  tableGuildProblemsCrafts,
  tableGuildProblemsHobbies,
  tableGuildProblemsMagic,
  tableGuildProblemsMerchants,
  tableGuildProblemsResources,
  tableGuildProblemsSciences,
  tableGuildProblemsSpectacle,
  tableGuildQuirk,
  tableGuildRenown,
  tableGuildResources,
  tableGuildSpecialAsset,
  type Guild,
  type GuildField,
  type GuildTableResult,
};
