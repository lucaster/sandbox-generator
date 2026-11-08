import {
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
} from './wizard';

function sequence(values: number[], fallback = 1) {
  let index = 0;
  return (faces: number) => Math.min(values[index++] ?? fallback, faces);
}

describe('wizard.ts tables', () => {
  it('uses the 2023 specialty and element tables', () => {
    expect(tableWizardSpecialty.dice).toBe('1d12');
    expect(tableWizardSpecialty.options).toEqual({
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
    });

    expect(tableWizardElement.options).toEqual({
      1: 'Air',
      2: 'Earth',
      3: 'Fire',
      4: 'Water',
    });
  });

  it('uses the 2023 appearance and goal tables', () => {
    expect(tableWizardAppearance.options).toEqual({
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
    });

    expect(tableWizardGoal.options).toEqual({
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
    });
  });

  it('uses the 2023 staff tables', () => {
    expect(tableWizardStaffMaterial.options).toEqual({
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
    });

    expect(tableWizardStaffTop.options).toEqual({
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
    });

    expect(tableWizardStaffBottom.options).toEqual({
      1: 'Blade',
      2: 'Burnt',
      3: 'Orb',
      4: 'Plain',
      5: 'Pointy',
      6: 'Same as the top',
      7: 'Skeletal foot',
      8: 'Weighted',
    });

    expect(tableWizardStaffShape.options).toEqual({
      1: 'Straight',
      2: 'Straight',
      3: 'Straight',
      4: 'Straight',
      5: 'Angular',
      6: 'Curved',
      7: 'Shaped like a lightning bolt',
      8: 'Twisted',
    });

    expect(tableWizardStaffDetail.options).toEqual({
      1: 'Covered with rope',
      2: 'Cracked',
      3: 'Decorated with feathers',
      4: 'Engraved with runes',
      5: 'Hollow',
      6: 'Used',
    });
  });
});

describe('wizard.ts calcWizard', () => {
  it('reproduces the book example (level 8 white magic wizard)', () => {
    const wizard = calcWizard(
      sequence([
        2, // level 2d6 = 5 -> level 8
        3,
        12, // White magic
        1, // Robe and pointy hat
        7, // Creating a new spell
        4, // Gold-plated
        3, // Crystal/Precious stone
        8, // Weighted
        5, // Angular
        5, // Hollow
      ])
    );

    expect(wizard).toEqual({
      level: 8,
      specialty: 'White magic',
      appearance: 'Robe and pointy hat (color depends on specialty)',
      goal: 'Creating a new spell',
      staff: {
        material: 'Gold-plated',
        top: 'Crystal/Precious stone',
        bottom: 'Weighted',
        shape: 'Angular',
        detail: 'Hollow',
      },
    });
  });

  it('maps every 2d6 total to the 2023 level table', () => {
    const expected: { [total: number]: number } = {
      2: 7,
      3: 8,
      4: 8,
      5: 8,
      6: 9,
      7: 9,
      8: 9,
      9: 10,
      10: 10,
      11: 10,
      12: 11,
    };

    for (let total = 2; total <= 12; total++) {
      const first = Math.min(total - 1, 6);
      const second = total - first;
      const wizard = calcWizard(sequence([first, second]));

      expect(wizard.level).toBe(expected[total]);
    }
  });

  it('does not raise low levels to 9 like tower wizards', () => {
    const wizard = calcWizard(sequence([1, 1]));

    expect(wizard.level).toBe(7);
  });

  it('rolls 1d4 for an elemental specialty', () => {
    const requestedFaces: number[] = [];
    let index = 0;
    const values = [1, 1, 7, 3];
    const wizard = calcWizard((faces) => {
      requestedFaces.push(faces);
      return Math.min(values[index++] ?? 1, faces);
    });

    expect(requestedFaces.slice(0, 4)).toEqual([6, 6, 12, 4]);
    expect(wizard.specialty).toBe('Elemental magic (Fire)');
  });

  it('does not roll the element table for a non-elemental specialty', () => {
    const requestedFaces: number[] = [];
    calcWizard((faces) => {
      requestedFaces.push(faces);
      return 1;
    });

    expect(requestedFaces).toEqual([6, 6, 12, 12, 12, 10, 20, 8, 8, 6]);
  });
});
