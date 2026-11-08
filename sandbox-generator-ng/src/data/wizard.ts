import { d } from '../dice/dice';
import { type RandomTable } from '../domain/random-table';
import { randomOptionEntry } from './data';
import { tableTowerWizardLevel } from './settlements';

type Wizard = {
  level: number;
  specialty: string;
  appearance: string;
  goal: string;
  staff: {
    material: string;
    top: string;
    bottom: string;
    shape: string;
    detail: string;
  };
};

const tableWizardSpecialty: RandomTable = {
  id: 195,
  title: 'Wizard Specialty',
  dice: '1d12',
  options: {
    1: 'None (generalist)',
    2: 'None (generalist)',
    3: 'None (generalist)',
    4: 'None (generalist)',
    5: 'None (generalist)',
    6: 'Alchemy',
    7: 'Elemental magic',
    8: 'Illusion',
    9: 'Invocation',
    10: 'Necromancy',
    11: 'Strange unique domain',
    12: 'White magic',
  },
};

const tableWizardElement: RandomTable = {
  id: 196,
  title: 'Wizard Elemental Magic',
  dice: '1d4',
  options: {
    1: 'Air',
    2: 'Earth',
    3: 'Fire',
    4: 'Water',
  },
};

const tableWizardAppearance: RandomTable = {
  id: 197,
  title: 'Wizard General Appearance',
  dice: '1d12',
  options: {
    1: 'Robe and pointy hat (color depends on specialty)',
    2: 'Robe and pointy hat (color depends on specialty)',
    3: 'Robe and pointy hat (color depends on specialty)',
    4: 'Robe and pointy hat (color depends on specialty)',
    5: 'Robe and pointy hat (color depends on specialty)',
    6: 'Casual clothes',
    7: 'Corrupted by magic',
    8: 'Formal attire',
    9: 'Leaves no doubt about their specialty',
    10: 'Mysterious',
    11: 'Plain clothes & scrawny body',
    12: 'Scruffy',
  },
};

const tableWizardGoal: RandomTable = {
  id: 198,
  title: 'Wizard Long Term Goal',
  dice: '1d12',
  options: {
    1: 'Lust for power',
    2: 'Lust for power',
    3: 'Lust for power',
    4: 'Lust for power',
    5: 'Lust for power',
    6: 'Altruism',
    7: 'Creating a new spell',
    8: 'Immortality',
    9: 'Impressing someone',
    10: 'Madness',
    11: 'Money',
    12: 'Revenge',
  },
};

const tableWizardStaffMaterial: RandomTable = {
  id: 199,
  title: 'Wizard Staff Material',
  dice: '1d10',
  options: {
    1: 'Bone/Ivory',
    2: 'Crystal',
    3: 'Copper/Bronze',
    4: 'Gold-plated',
    5: 'Mithral',
    6: 'Obsidian',
    7: 'Otherworldly material',
    8: 'Silver-plated',
    9: 'Steel',
    10: 'Wood',
  },
};

const tableWizardStaffTop: RandomTable = {
  id: 200,
  title: 'Wizard Staff Top',
  dice: '1d20',
  options: {
    1: 'Angel',
    2: 'Claw',
    3: 'Crystal/Precious stone',
    4: 'Deer head',
    5: 'Dragon head',
    6: 'Eagle',
    7: 'Eye',
    8: 'Fish head',
    9: 'Heart',
    10: 'Holy symbol',
    11: 'Orb',
    12: 'Plain',
    13: 'Pointy',
    14: 'Shaped like a question mark',
    15: 'Skeletal hand',
    16: 'Skull',
    17: 'Snake head',
    18: 'Sun/Moon/Star',
    19: 'Talking skull',
    20: 'Weight',
  },
};

const tableWizardStaffBottom: RandomTable = {
  id: 201,
  title: 'Wizard Staff Bottom',
  dice: '1d8',
  options: {
    1: 'Blade',
    2: 'Burnt',
    3: 'Orb',
    4: 'Plain',
    5: 'Pointy',
    6: 'Same as the top',
    7: 'Skeletal foot',
    8: 'Weighted',
  },
};

const tableWizardStaffShape: RandomTable = {
  id: 202,
  title: 'Wizard Staff Shape',
  dice: '1d8',
  options: {
    1: 'Straight',
    2: 'Straight',
    3: 'Straight',
    4: 'Straight',
    5: 'Angular',
    6: 'Curved',
    7: 'Shaped like a lightning bolt',
    8: 'Twisted',
  },
};

const tableWizardStaffDetail: RandomTable = {
  id: 203,
  title: 'Wizard Staff Detail',
  dice: '1d6',
  options: {
    1: 'Covered with rope',
    2: 'Cracked',
    3: 'Decorated with feathers',
    4: 'Engraved with runes',
    5: 'Hollow',
    6: 'Used',
  },
};

/**
 * Generates a wizard from the 2023 edition Generators chapter (p. 147-149).
 *
 * The level table is the same one used for tower wizards (p. 147), but unlike
 * `calcTowerWizard` it does not raise low rolls to level 9: a random wizard can
 * be level 7 or 8.
 */
function calcWizard(rollFn: (faces: number) => number = d): Wizard {
  const level = Number(
    randomOptionEntry(tableTowerWizardLevel, rollFn).result
  );

  const specialtyEntry = randomOptionEntry(tableWizardSpecialty, rollFn);
  const specialty =
    specialtyEntry.result === 'Elemental magic'
      ? `Elemental magic (${randomOptionEntry(tableWizardElement, rollFn).result})`
      : specialtyEntry.result;

  const appearance = randomOptionEntry(tableWizardAppearance, rollFn).result;
  const goal = randomOptionEntry(tableWizardGoal, rollFn).result;

  const material =
    randomOptionEntry(tableWizardStaffMaterial, rollFn).result;
  const top = randomOptionEntry(tableWizardStaffTop, rollFn).result;
  const bottom = randomOptionEntry(tableWizardStaffBottom, rollFn).result;
  const shape = randomOptionEntry(tableWizardStaffShape, rollFn).result;
  const detail = randomOptionEntry(tableWizardStaffDetail, rollFn).result;

  return {
    level,
    specialty,
    appearance,
    goal,
    staff: {
      material,
      top,
      bottom,
      shape,
      detail,
    },
  };
}

export {
  calcWizard,
  tableWizardAppearance,
  tableWizardElement,
  tableWizardGoal,
  tableWizardSpecialty,
  tableWizardStaffBottom,
  tableWizardStaffDetail,
  tableWizardStaffMaterial,
  tableWizardStaffShape,
  tableWizardStaffTop,
  type Wizard,
};
