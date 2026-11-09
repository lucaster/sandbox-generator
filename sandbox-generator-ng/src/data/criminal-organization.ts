import { d } from '../dice/dice';
import { type RandomTable } from '../domain/random-table';
import { randomOptionEntry } from './data';

type CriminalOrganizationTableResult = {
  roll: number;
  result: string;
};

type CriminalOrganization = {
  name: CriminalOrganizationTableResult & {
    template: string;
  };
  mainActivity: CriminalOrganizationTableResult;
  distinctiveSign: CriminalOrganizationTableResult;
  recruits: CriminalOrganizationTableResult;
  initiationRite: CriminalOrganizationTableResult;
  organization: CriminalOrganizationTableResult;
  finances: CriminalOrganizationTableResult;
  specialCheckRoll: number;
  special: CriminalOrganizationTableResult | null;
  hideoutFront: CriminalOrganizationTableResult;
  specialRoom: CriminalOrganizationTableResult;
  boss: CriminalOrganizationTableResult;
};

// Book: Generators > Criminal organization > 1) Name, p. 117.
const tableCriminalOrganizationName: RandomTable = {
  id: 279,
  title: 'Criminal Organization Name',
  dice: '1d30',
  options: {
    1: "... Boys/Girls",
    2: '... Mafia',
    3: '... Syndicate',
    4: "...'s Band",
    5: "...'s Gang",
    6: 'Aces of spades',
    7: 'Atelier Clandestin',
    8: 'Black Bears',
    9: 'Blood Brothers/Sisters',
    10: 'Children of ...',
    11: 'City Predators',
    12: 'Crows',
    13: 'Dancing Rats',
    14: 'Dark Knights',
    15: 'Devils',
    16: 'Disciples of ...',
    17: 'Gold Diggers',
    18: 'Howling Wolves',
    19: 'Iron Heads',
    20: 'Jacks of Hearts',
    21: "King's Fools",
    22: 'Night Birds',
    23: 'Parasites',
    24: 'Party Kings/Queens',
    25: 'Phantoms',
    26: 'Sneaky Snakes',
    27: 'Street Brats',
    28: 'Team ...',
    29: 'Troublemakers',
    30: 'Vultures',
  },
};

// Book: Generators > Criminal organization > 2) Main activity, p. 117.
const tableCriminalOrganizationMainActivity: RandomTable = {
  id: 280,
  title: 'Criminal Organization Main Activity',
  dice: '1d24',
  options: {
    1: 'Assassination',
    2: 'Betting',
    3: 'Blackmailing',
    4: 'Burglary',
    5: 'Caravan attacks',
    6: 'Demolition',
    7: 'Fencing',
    8: 'Forgery',
    9: 'Gambling',
    10: 'Kidnapping',
    11: 'Loan sharking',
    12: 'Mercenary work',
    13: 'Money laundering',
    14: 'Pickpocketing',
    15: 'Poisoning',
    16: 'Prostitution',
    17: 'Racketing',
    18: 'Robbery',
    19: 'Scamming',
    20: 'Selling drugs',
    21: 'Smuggling',
    22: 'Spying',
    23: 'Starting riots',
    24: 'Two main activities',
  },
};

// Book: Generators > Criminal organization > 3) Distinctive sign, p. 117.
const tableCriminalOrganizationDistinctiveSign: RandomTable = {
  id: 281,
  title: 'Criminal Organization Distinctive Sign',
  dice: '1d10',
  options: {
    1: 'Cut finger',
    2: 'Handshake/Hand signs',
    3: 'Hot iron mark',
    4: 'Jewelry',
    5: 'Makeup',
    6: 'Mask',
    7: 'Scar',
    8: 'Tattoo',
    9: 'Uniform',
    10: 'Weapon',
  },
};

// Book: Generators > Criminal organization > 4) Recruits, p. 118.
const tableCriminalOrganizationRecruits: RandomTable = {
  id: 282,
  title: 'Criminal Organization Recruits',
  dice: '1d20',
  options: {
    1: 'Athletes',
    2: 'Death row inmates',
    3: 'Delinquents',
    4: 'Dropout students',
    5: 'Experts in their field',
    6: 'Homeless people',
    7: 'Junkies',
    8: 'Mercenaries',
    9: 'Orphans',
    10: 'Pagans',
    11: 'People in debt',
    12: 'Prisoners',
    13: 'Refugees',
    14: 'Religious people',
    15: 'Scholars',
    16: 'Slaves',
    17: 'Street urchins',
    18: 'Unemployed people',
    19: 'Veterans',
    20: 'Workers',
  },
};

// Book: Generators > Criminal organization > 4) Initiation rite, p. 118.
const tableCriminalOrganizationInitiationRite: RandomTable = {
  id: 283,
  title: 'Criminal Organization Initiation Rite',
  dice: '1d12',
  options: {
    1: 'Baptism',
    2: 'Blood ritual',
    3: 'Carousing',
    4: 'Fancy dinner',
    5: 'Hazing',
    6: 'Kidnapping',
    7: 'Killing someone close',
    8: 'Occult ceremony',
    9: 'Pompous ceremony',
    10: 'Taking an oath',
    11: 'Torture',
    12: 'Trials',
  },
};

// Book: Generators > Criminal organization > 5) Organization, p. 118.
const tableCriminalOrganizationInternalStructure: RandomTable = {
  id: 284,
  title: 'Criminal Organization Internal Structure',
  dice: '1d12',
  options: {
    1: 'Apprenticeship',
    2: 'Cells',
    3: 'Family',
    4: 'Fellowship',
    5: 'Fraternity/Sorority',
    6: 'Hierarchical',
    7: 'Meritocracy',
    8: 'Nobility',
    9: 'Pecking order',
    10: 'Pyramidal',
    11: 'Secret society',
    12: 'Sponsorship',
  },
};

// Book: Generators > Criminal organization > 5) Finances, p. 118.
const tableCriminalOrganizationFinances: RandomTable = {
  id: 285,
  title: 'Criminal Organization Finances',
  dice: '1d12',
  options: {
    1: 'Bankruptcy',
    2: 'Running low',
    3: 'Running low',
    4: 'Losing money',
    5: 'Losing money',
    6: 'Losing money',
    7: 'Expanding business',
    8: 'Expanding business',
    9: 'Expanding business',
    10: 'Going strong',
    11: 'Going strong',
    12: 'Owns the place',
  },
};

// Book: Generators > Criminal organization > 5) Special, p. 118.
const tableCriminalOrganizationSpecial: RandomTable = {
  id: 286,
  title: 'Criminal Organization Special',
  dice: '1d10',
  options: {
    1: 'Aims at doing good',
    2: 'Cursed',
    3: 'Goes back centuries',
    4: 'Has an influence on politics',
    5: 'Invented a coded language',
    6: 'Mythical',
    7: 'No member can ever leave',
    8: 'Protected by officials',
    9: "Protection of the members' families",
    10: 'Serves a demon/god',
  },
};

// Book: Generators > Criminal organization > 6) Hideout/Front, p. 119.
const tableCriminalOrganizationHideoutFront: RandomTable = {
  id: 287,
  title: 'Criminal Organization Hideout/Front',
  dice: '1d20',
  options: {
    1: 'Abandoned building',
    2: 'Bath house',
    3: 'Casino',
    4: 'Castle',
    5: 'Catacombs',
    6: 'Cave network',
    7: 'Dungeon',
    8: 'Forest',
    9: 'Guild building',
    10: 'Mansion',
    11: 'Pocket dimension',
    12: 'Sewers',
    13: 'Shop',
    14: 'Sports/Hobby club',
    15: 'Tavern',
    16: 'Temple',
    17: 'Tower',
    18: 'Underground facility',
    19: 'University',
    20: 'Youth organization',
  },
};

// Book: Generators > Criminal organization > 6) Special room, p. 119.
const tableCriminalOrganizationSpecialRoom: RandomTable = {
  id: 288,
  title: 'Criminal Organization Special Room',
  dice: '1d24',
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
    11: 'None',
    12: 'None',
    13: 'Archives',
    14: 'Cells',
    15: 'Cold chamber',
    16: 'Exhibition room',
    17: 'Luxurious room',
    18: 'Panic room',
    19: 'Ritual room',
    20: 'Scheming room',
    21: 'Secret lab',
    22: 'Shark pool',
    23: 'Torture room',
    24: 'Vault',
  },
};

// Book: Generators > Criminal organization > 7) Boss, pp. 119-120.
const tableCriminalOrganizationBoss: RandomTable = {
  id: 289,
  title: 'Criminal Organization Boss',
  dice: '1d20',
  options: {
    1: "The organization's boss was cryogenized years ago; the members use all the money they earn to maintain them in a stable state until they wake up.",
    2: 'Years ago, the second took on the appearance of the boss who had just died and made them promise to keep the organization running.',
    3: 'The boss has had many other names and jobs in the past as they became immortal a long time ago.',
    4: "The boss is related to a high up official and does not care about ruining their relative's career because of their criminal activities.",
    5: 'Because of their small height and their high pitched voice, the boss had a hard time earning respect at first, but today they are the most feared leader.',
    6: 'The boss is a giant who is known for their apparent indifference. The only words they ever speak are always death sentences.',
    7: 'The boss is an orphan who was mistreated and created the organization to get revenge.',
    8: 'In this organization, the boss started at the bottom and held every possible position until they eventually reached the top.',
    9: 'The boss comes from a family of successful criminals. They left home and created a criminal group to prove their own worth.',
    10: 'The boss had a respectable job while conducting criminal activities until they had to make a choice and went for the most profitable option.',
    11: 'The boss of this organization is a cleanliness freak who sometimes targets people who disgust them.',
    12: 'The motivations of the boss are to eventually turn the city into a better place to live in, even if it means making it worse for a while.',
    13: 'The boss only sends their orders through letters, and because they have not been seen for a long time, the members all secretly question their identity.',
    14: 'The boss has taken management seminars and tries to deal with incompetent members in a gentler way, but they often come back to the good old methods.',
    15: 'The boss is barely kept alive by expensive medication but still wants to lead the criminal activities of their group.',
    16: 'Each time the boss is thought to be dead, they eventually come back because they have a bunch of clones/lookalikes.',
    17: 'The boss secretly has a big artistic career and that passion might someday be the cause of their downfall.',
    18: 'The boss is so big that they have not left their office in years. They must be fed by the members. They often demand to be served rare meats.',
    19: 'The boss keeps a journal where they draw the portraits of all the members and rate their performances. Those with the lowest rankings get executed every year.',
    20: 'The boss is very imposing and always wears a fur coat, gold chains and rings. They are also never seen without a cigar. Their enemies call them "The Bear".',
  },
};

function rollEntry(
  table: RandomTable,
  rollFn: (faces: number) => number,
): CriminalOrganizationTableResult {
  const entry = randomOptionEntry(table, rollFn);
  return { roll: entry.roll, result: entry.result };
}

function calcCriminalOrganization(
  options: {
    fittingName?: string;
    rollFn?: (faces: number) => number;
  } = {},
): CriminalOrganization {
  const rollFn = options.rollFn ?? d;
  const nameEntry = randomOptionEntry(tableCriminalOrganizationName, rollFn);
  const fittingName = options.fittingName?.trim();
  const template = nameEntry.result;
  const name = fittingName ? template.replaceAll('...', fittingName) : template;
  const mainActivity = rollEntry(tableCriminalOrganizationMainActivity, rollFn);
  const distinctiveSign = rollEntry(tableCriminalOrganizationDistinctiveSign, rollFn);
  const recruits = rollEntry(tableCriminalOrganizationRecruits, rollFn);
  const initiationRite = rollEntry(tableCriminalOrganizationInitiationRite, rollFn);
  const organization = rollEntry(tableCriminalOrganizationInternalStructure, rollFn);
  const finances = rollEntry(tableCriminalOrganizationFinances, rollFn);
  // The text prescribes a 1-in-6 check before rolling the special table.
  const specialCheckRoll = rollFn(6);
  const special = specialCheckRoll === 1
    ? rollEntry(tableCriminalOrganizationSpecial, rollFn)
    : null;
  const hideoutFront = rollEntry(tableCriminalOrganizationHideoutFront, rollFn);
  const specialRoom = rollEntry(tableCriminalOrganizationSpecialRoom, rollFn);
  const boss = rollEntry(tableCriminalOrganizationBoss, rollFn);

  return {
    name: { roll: nameEntry.roll, template, result: name },
    mainActivity,
    distinctiveSign,
    recruits,
    initiationRite,
    organization,
    finances,
    specialCheckRoll,
    special,
    hideoutFront,
    specialRoom,
    boss,
  };
}

export {
  calcCriminalOrganization,
  tableCriminalOrganizationBoss,
  tableCriminalOrganizationDistinctiveSign,
  tableCriminalOrganizationFinances,
  tableCriminalOrganizationHideoutFront,
  tableCriminalOrganizationInitiationRite,
  tableCriminalOrganizationInternalStructure,
  tableCriminalOrganizationMainActivity,
  tableCriminalOrganizationName,
  tableCriminalOrganizationRecruits,
  tableCriminalOrganizationSpecial,
  tableCriminalOrganizationSpecialRoom,
  type CriminalOrganization,
  type CriminalOrganizationTableResult,
};
