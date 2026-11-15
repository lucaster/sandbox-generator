import type { LairRolls } from '../data/lairs';

/**
 * Builds the link that replays a lair on the /lairs page. The rolls are kept
 * together with the biome so the linked page can reproduce the exact lair.
 */
function lairUrl(biome: string, rolls: LairRolls): string {
  return `/lairs?biome=${encodeURIComponent(biome)}&rolls=${rolls.join(',')}`;
}

/**
 * Reads the lair parameters from the query string. Returns null when the page
 * was opened without a link, and throws when the link is only partially valid.
 */
function parseLairLink(params: {
  get(name: string): string | null;
}): { biome: string; rolls: LairRolls } | null {
  const biome = params.get('biome');
  const rollsParam = params.get('rolls');
  if (biome === null && rollsParam === null) {
    return null;
  }
  if (!biome || rollsParam === null) {
    throw new Error('Lair link must include both biome and rolls.');
  }

  const rolls = rollsParam.split(',').map(Number);
  if (!rolls.length || !rolls.every((roll) => Number.isInteger(roll) && roll > 0)) {
    throw new Error('Lair link rolls must be a comma-separated list of positive integers.');
  }
  return { biome, rolls };
}

export { lairUrl, parseLairLink };
