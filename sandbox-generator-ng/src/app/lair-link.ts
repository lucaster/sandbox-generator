import type { LairRolls } from '../data/lairs';

// The lair is rebuilt by replaying the rolls in the same order as calcLair:
// two d6 for the inhabitants, one d6 for the monsters outside, one d8 for the
// outside hexes (two more d8 when it rolls an 8), and one d8 for the layout.
// Each roll has its own query parameter so a link reads like the procedure.
const rollParams = [
  'inhabitantsRoll1',
  'inhabitantsRoll2',
  'outsideRoll',
  'outsideHexesRoll',
  'outsideGroupRoll1',
  'outsideGroupRoll2',
  'layoutRoll',
] as const;

/**
 * Builds the link that replays a lair on the /lairs page. The rolls are kept
 * together with the biome so the linked page can reproduce the exact lair.
 */
function lairUrl(biome: string, rolls: LairRolls): string {
  const [inhabitantsRoll1, inhabitantsRoll2, outsideRoll, outsideHexesRoll] =
    rolls;
  const splitOutsideHexes = outsideHexesRoll === 8;
  const params = new URLSearchParams({
    biome,
    inhabitantsRoll1: String(inhabitantsRoll1),
    inhabitantsRoll2: String(inhabitantsRoll2),
    outsideRoll: String(outsideRoll),
    outsideHexesRoll: String(outsideHexesRoll),
  });

  if (splitOutsideHexes) {
    params.set('outsideGroupRoll1', String(rolls[4]));
    params.set('outsideGroupRoll2', String(rolls[5]));
  }
  // A split force adds two rolls, so the layout moves from index 4 to 6.
  params.set('layoutRoll', String(rolls[splitOutsideHexes ? 6 : 4]));

  return `/lairs?${params.toString()}`;
}

/**
 * Reads the lair parameters from the query string. Returns null when the page
 * was opened without a link, and throws when the link is only partially valid.
 */
function parseLairLink(params: {
  get(name: string): string | null;
}): { biome: string; rolls: LairRolls } | null {
  const biome = params.get('biome');
  const hasRoll = rollParams.some((name) => params.get(name) !== null);
  if (biome === null && !hasRoll) {
    return null;
  }
  if (biome === null) {
    throw new Error('Lair link must include the biome.');
  }

  const inhabitantsRoll1 = lairRoll(params, 'inhabitantsRoll1', 6);
  const inhabitantsRoll2 = lairRoll(params, 'inhabitantsRoll2', 6);
  const outsideRoll = lairRoll(params, 'outsideRoll', 6);
  const outsideHexesRoll = lairRoll(params, 'outsideHexesRoll', 8);
  const rolls: LairRolls = [
    inhabitantsRoll1,
    inhabitantsRoll2,
    outsideRoll,
    outsideHexesRoll,
  ];

  const hasOutsideGroup =
    params.get('outsideGroupRoll1') !== null ||
    params.get('outsideGroupRoll2') !== null;
  if (outsideHexesRoll === 8) {
    rolls.push(
      lairRoll(params, 'outsideGroupRoll1', 8),
      lairRoll(params, 'outsideGroupRoll2', 8)
    );
  } else if (hasOutsideGroup) {
    throw new Error(
      'Lair link outside groups are only used when outsideHexesRoll is 8.'
    );
  }

  rolls.push(lairRoll(params, 'layoutRoll', 8));
  return { biome, rolls };
}

function lairRoll(
  params: { get(name: string): string | null },
  name: string,
  faces: number
): number {
  const raw = params.get(name);
  if (raw === null || raw === '') {
    throw new Error(`Lair link must include ${name}.`);
  }
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > faces) {
    throw new Error(`Lair link ${name} must be an integer from 1 to ${faces}.`);
  }
  return value;
}

export { lairUrl, parseLairLink };
