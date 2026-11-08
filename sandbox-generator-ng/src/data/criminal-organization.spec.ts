import {
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
} from './criminal-organization';

const tables = [
  tableCriminalOrganizationName,
  tableCriminalOrganizationMainActivity,
  tableCriminalOrganizationDistinctiveSign,
  tableCriminalOrganizationRecruits,
  tableCriminalOrganizationInitiationRite,
  tableCriminalOrganizationInternalStructure,
  tableCriminalOrganizationFinances,
  tableCriminalOrganizationSpecial,
  tableCriminalOrganizationHideoutFront,
  tableCriminalOrganizationSpecialRoom,
  tableCriminalOrganizationBoss,
];

describe('criminal organization tables', () => {
  it('covers every result from the 2023 Criminal Organization tables', () => {
    for (const table of tables) {
      const faces = Number(table.dice?.split('d')[1]);
      expect(Object.keys(table.options).map(Number))
        .withContext(table.title)
        .toEqual(Array.from({ length: faces }, (_, index) => index + 1));
      expect(Object.values(table.options).every((result) => typeof result === 'string'))
        .withContext(table.title)
        .toBeTrue();
    }

    expect(tables.map((table) => table.id)).toEqual([
      279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289,
    ]);
    expect(tableCriminalOrganizationFinances.options).toEqual({
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
    });
    expect(tableCriminalOrganizationSpecialRoom.options[12]).toBe('None');
    expect(tableCriminalOrganizationSpecialRoom.options[13]).toBe('Archives');
    expect(tableCriminalOrganizationBoss.options[20]).toContain('"The Bear"');
  });
});

describe('calcCriminalOrganization', () => {
  it('generates the tables in book order and rolls the optional special only on a 1', () => {
    const calls: number[] = [];
    const organization = calcCriminalOrganization({
      rollFn: (faces) => {
        calls.push(faces);
        return 1;
      },
    });

    expect(calls).toEqual([30, 24, 10, 20, 12, 12, 12, 6, 10, 20, 24, 20]);
    expect(organization.name).toEqual({
      roll: 1,
      template: "... Boys/Girls",
      result: "... Boys/Girls",
    });
    expect(organization.specialCheckRoll).toBe(1);
    expect(organization.special).toEqual({ roll: 1, result: 'Aims at doing good' });
    expect(organization.specialRoom).toEqual({ roll: 1, result: 'None' });
  });

  it('fills only the name-table placeholder with the fitting name supplied by the caller', () => {
    const organization = calcCriminalOrganization({
      fittingName: 'Silver',
      rollFn: (faces) => faces === 30 ? 10 : 1,
    });

    expect(organization.name).toEqual({
      roll: 10,
      template: 'Children of ...',
      result: 'Children of Silver',
    });
  });

  it('does not roll the optional special table when the check is not 1', () => {
    const calls: number[] = [];
    const organization = calcCriminalOrganization({
      rollFn: (faces) => {
        calls.push(faces);
        return faces === 6 ? 6 : 1;
      },
    });

    expect(organization.specialCheckRoll).toBe(6);
    expect(organization.special).toBeNull();
    expect(calls).toEqual([30, 24, 10, 20, 12, 12, 12, 6, 20, 24, 20]);
  });
});
