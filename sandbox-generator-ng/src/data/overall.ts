import { d } from '../dice/dice';
import {
  calcLandmarkContentsWithRolls,
  contentFromRolls,
  type ContentPatchRolls,
} from './content';
import {
  calcHexesBiomeWithRolls,
  calcHexesDetailedFeatureWithRolls,
  hexesBiomeFromRolls,
  hexesDetailedFeatureFromRolls,
  type Hexes,
  type HexesDetailed,
  type HexRolls,
  type HexRollSequences,
} from './data';
import {
  calcFactionsFromRolls,
  calcFactionsWithRolls,
  type FactionResult,
  type FactionRolls,
} from './factions';
import {
  calcLairFromRolls,
  calcLairWithRolls,
  type LairRolls,
} from './lairs';

type OverallPatchRolls = {
  biomeRolls: HexRolls;
  featureRolls: HexRollSequences;
  lairRolls: { [hex: number]: LairRolls };
  factionRolls: FactionRolls;
  contentRolls: ContentPatchRolls;
};

type OverallPatch = {
  biomes: Hexes;
  hexesDetailed: HexesDetailed;
  lairs: { [hex: number]: ReturnType<typeof calcLairFromRolls> };
  factionResult: FactionResult;
  contents: { [hex: number]: ReturnType<typeof contentFromRolls> };
};

function calcOverallPatchWithRolls(
  rollFn: (faces: number) => number = d
): { patch: OverallPatch; rolls: OverallPatchRolls } {
  const biomeData = calcHexesBiomeWithRolls(rollFn);
  const featureData = calcHexesDetailedFeatureWithRolls(rollFn);

  const lairs: OverallPatch['lairs'] = {};
  const lairRolls: { [hex: number]: LairRolls } = {};
  for (const hex of hexesWith(featureData.hexesDetailed, 'Lair')) {
    const result = calcLairWithRolls(biomeData.biomes[hex], {}, rollFn);
    lairs[hex] = result.lair;
    lairRolls[hex] = result.rolls;
  }

  const factionData = calcFactionsWithRolls(
    featureData.hexesDetailed,
    { lairInhabitants: inhabitantsOf(lairs) },
    rollFn
  );
  const contentData = calcLandmarkContentsWithRolls(featureData.hexesDetailed, rollFn);

  return {
    patch: {
      biomes: biomeData.biomes,
      hexesDetailed: featureData.hexesDetailed,
      lairs,
      factionResult: factionData.result,
      contents: contentData.contents,
    },
    rolls: {
      biomeRolls: biomeData.rolls,
      featureRolls: featureData.rolls,
      lairRolls,
      factionRolls: factionData.rolls,
      contentRolls: contentData.rolls,
    },
  };
}

/**
 * Rebuilds an overall patch from exported rolls. Accepts the raw JSON so the
 * imported structure is validated before any hex is drawn.
 */
function overallPatchFromRolls(value: unknown): {
  patch: OverallPatch;
  rolls: OverallPatchRolls;
} {
  const input = asObject(value, 'Hex overall patch');
  const biomeRolls = asBiomeRolls(input['biomeRolls']);
  const featureRolls = asHexRollsObject(
    input['featureRolls'],
    'Feature rolls'
  ) as HexRollSequences;
  const lairRolls = asHexRollsObject(input['lairRolls'], 'Lair rolls');
  const factionRolls = asIntegerArray(input['factionRolls'], 'Faction rolls');
  const contentRolls = asContentRolls(input['contentRolls']);

  const biomes = hexesBiomeFromRolls(biomeRolls);
  const hexesDetailed = hexesDetailedFeatureFromRolls(featureRolls);

  const lairHexes = hexesWith(hexesDetailed, 'Lair');
  assertHexSet(lairRolls, lairHexes, 'lair');
  const lairs: OverallPatch['lairs'] = {};
  for (const hex of lairHexes) {
    lairs[hex] = calcLairFromRolls(biomes[hex], lairRolls[hex]);
  }

  const factionResult = calcFactionsFromRolls(
    hexesDetailed,
    factionRolls,
    { lairInhabitants: inhabitantsOf(lairs) }
  );

  const landmarkHexes = hexesWith(hexesDetailed, 'Landmark');
  assertHexSet(contentRolls, landmarkHexes, 'content');
  const contents: OverallPatch['contents'] = {};
  for (const hex of landmarkHexes) {
    contents[hex] = contentFromRolls(contentRolls[hex]);
  }

  return {
    patch: { biomes, hexesDetailed, lairs, factionResult, contents },
    rolls: { biomeRolls, featureRolls, lairRolls, factionRolls, contentRolls },
  };
}

function hexesWith(hexesDetailed: HexesDetailed, feature: string): number[] {
  return Object.entries(hexesDetailed)
    .filter(([, details]) => details.includes(feature))
    .map(([hex]) => Number(hex))
    .sort((a, b) => a - b);
}

function inhabitantsOf(lairs: OverallPatch['lairs']): { [hex: number]: string } {
  const result: { [hex: number]: string } = {};
  for (const [hex, lair] of Object.entries(lairs)) {
    result[Number(hex)] = lair.inhabitants;
  }
  return result;
}

function assertHexSet(
  rolls: { [hex: number]: unknown },
  expected: number[],
  label: string
) {
  const actual = Object.keys(rolls)
    .map(Number)
    .sort((a, b) => a - b);
  if (
    actual.length !== expected.length ||
    actual.some((hex, index) => hex !== expected[index])
  ) {
    throw new Error(
      `Expected ${label} rolls for hexes ${expected.join(', ') || 'none'} and no others.`
    );
  }
}

function asObject(value: unknown, label: string): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(`${label} must be a JSON object.`);
  }
  return value as Record<string, unknown>;
}

function asIntegerArray(value: unknown, label: string): number[] {
  if (
    !Array.isArray(value) ||
    !value.every((item) => typeof item === 'number' && Number.isInteger(item))
  ) {
    throw new Error(`${label} must be an array of integers.`);
  }
  return [...value];
}

function hexNumber(key: string, label: string): number {
  const hex = Number(key);
  if (!Number.isInteger(hex) || hex < 1 || hex > 19) {
    throw new Error(`Invalid ${label} hex number: ${key}.`);
  }
  return hex;
}

function asBiomeRolls(value: unknown): HexRolls {
  const input = asObject(value, 'Biome rolls');
  const result: HexRolls = {};
  for (const [hex, roll] of Object.entries(input)) {
    const hexNum = hexNumber(hex, 'biome');
    if (typeof roll !== 'number' || !Number.isInteger(roll)) {
      throw new Error(`Biome rolls for hex ${hex} must be integers.`);
    }
    result[hexNum] = roll;
  }
  return result;
}

function asHexRollsObject(
  value: unknown,
  label: string
): { [hex: number]: number[] } {
  const input = asObject(value, label);
  const result: { [hex: number]: number[] } = {};
  for (const [hex, rolls] of Object.entries(input)) {
    result[hexNumber(hex, label)] = asIntegerArray(rolls, `${label} for hex ${hex}`);
  }
  return result;
}

function asContentRolls(value: unknown): ContentPatchRolls {
  const input = asObject(value, 'Content rolls');
  const result: ContentPatchRolls = {};
  for (const [hex, entry] of Object.entries(input)) {
    const hexNum = hexNumber(hex, 'content');
    const rolls = asObject(entry, `Content rolls for hex ${hex}`);
    result[hexNum] = {
      pathRolls: asIntegerArray(rolls['pathRolls'], `Content path rolls for hex ${hex}`),
      treasureRoll: asNullableInteger(rolls['treasureRoll'], `Content treasure roll for hex ${hex}`),
      conveyRoll: asNullableInteger(rolls['conveyRoll'], `Content convey roll for hex ${hex}`),
    };
  }
  return result;
}

function asNullableInteger(value: unknown, label: string): number | null {
  if (value === null) {
    return null;
  }
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new Error(`${label} must be an integer or null.`);
  }
  return value;
}

export {
  calcOverallPatchWithRolls,
  overallPatchFromRolls,
  type OverallPatch,
  type OverallPatchRolls,
};
