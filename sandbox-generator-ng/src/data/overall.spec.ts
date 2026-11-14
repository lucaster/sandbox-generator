import {
  calcOverallPatchWithRolls,
  overallPatchFromRolls,
} from './overall';

function seeded(seed: number) {
  return (faces: number) => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return (seed % faces) + 1;
  };
}

function exportedRolls(seed: number) {
  return JSON.parse(
    JSON.stringify(calcOverallPatchWithRolls(seeded(seed)).rolls)
  );
}

describe('overall.ts', () => {
  it('replays the same patch from its exported rolls', () => {
    const generated = calcOverallPatchWithRolls(seeded(42));

    const replayed = overallPatchFromRolls(exportedRolls(42));

    expect(replayed.patch).toEqual(generated.patch);
    expect(replayed.rolls).toEqual(exportedRolls(42));
  });

  it('generates content and lair rolls only for the matching hexes', () => {
    const generated = calcOverallPatchWithRolls(seeded(7));
    const landmarkHexes = Object.entries(generated.patch.hexesDetailed)
      .filter(([, details]) => details.includes('Landmark'))
      .map(([hex]) => hex);
    const lairHexes = Object.entries(generated.patch.hexesDetailed)
      .filter(([, details]) => details.includes('Lair'))
      .map(([hex]) => hex);

    expect(Object.keys(generated.rolls.contentRolls).sort()).toEqual(
      landmarkHexes.sort()
    );
    expect(Object.keys(generated.rolls.lairRolls).sort()).toEqual(
      lairHexes.sort()
    );
  });

  it('rejects content rolls for a hex without a landmark', () => {
    const rolls = exportedRolls(7);
    rolls.contentRolls['1'] = {
      pathRolls: [1],
      treasureRoll: 1,
      conveyRoll: null,
    };

    expect(() => overallPatchFromRolls(rolls)).toThrowError(
      /Expected content rolls for hexes/
    );
  });

  it('rejects lair rolls for a hex without a lair', () => {
    const rolls = exportedRolls(7);
    rolls.lairRolls['1'] = [1];

    expect(() => overallPatchFromRolls(rolls)).toThrowError(
      /Expected lair rolls for hexes/
    );
  });
});
