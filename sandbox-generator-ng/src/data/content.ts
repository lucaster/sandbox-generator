import { d } from '../dice/dice';
import { RandomTable } from '../domain/random-table';
import { currHexNextHex, randomOptionEntry, type HexesDetailed } from './data';
import {
  tableContent,
  tableContentConvey,
  tableContentTreasureChance,
} from './content-tables';

type ContentRolls = {
  pathRolls: number[];
  treasureRoll: number | null;
  conveyRoll: number | null;
};
type ContentPatchRolls = { [hex: number]: ContentRolls };

/**
 * Follows a content table's nested tables and returns the whole path.
 * For example, ['Special', 'Related to landmark', 'Uncover a mystery', 'Curse'].
 */
function resolveContentPath(
  table: RandomTable,
  rollFn: (faces: number) => number
): string[] {
  const entry = randomOptionEntry(table, rollFn);
  const option = table.options[entry.roll];
  if (typeof option === 'string') {
    return [option];
  }
  return [option.text, ...resolveContentPath(option.nextTable, rollFn)];
}

/**
 * Follows a content table's nested tables and joins the path with ": ".
 * For example, "Related to landmark: Uncover a mystery: Curse".
 */
function resolveContentDetail(
  table: RandomTable,
  rollFn: (faces: number) => number
): string {
  return resolveContentPath(table, rollFn).join(': ');
}

function calcContentWithPath(rollFn: (faces: number) => number = d) {
  return calcContentWithRolls(rollFn).content;
}

function calcContentWithRolls(rollFn: (faces: number) => number = d) {
  const { path, rolls: contentRolls } = resolveContentPathWithRolls(tableContent, rollFn);
  const type = path[0];
  const detail = path.length > 1 ? path.slice(1).join(': ') : null;

  const chance = tableContentTreasureChance.options[type] ?? null;
  const treasureRoll = chance === null ? null : rollFn(100);
  const convey = type === 'Empty' ? randomOptionEntry(tableContentConvey, rollFn) : null;

  const hasTreasure =
    chance === null || treasureRoll === null
      ? null
      : treasureRoll <= chance * 100;

  const content = {
    path,
    type,
    detail,
    treasure: {
      chance,
      roll: treasureRoll,
      hasTreasure,
    },
    convey,
  };
  const rolls: ContentRolls = {
    pathRolls: contentRolls,
    treasureRoll,
    conveyRoll: convey?.roll ?? null,
  };
  return { content, rolls };
}

/**
 * Generates the content of a landmark hex (2023 edition, p. 17).
 *
 * The content type is Hazard, Empty, Special, or Monsters. Treasure is rolled
 * on 1d100 against the type's chance (Hazard 25%, Empty 15%, Monsters 50%).
 * Special rewards are variable and chosen by the DM. Empty hexes also produce
 * the information that can be learned and how it is conveyed (p. 22).
 */
function calcContent(rollFn: (faces: number) => number = d) {
  const content = calcContentWithPath(rollFn);
  return {
    type: content.type,
    detail: content.detail,
    treasure: content.treasure,
    convey: content.convey,
  };
}

/**
 * Generates a content patch, keeping both the table path used to draw the
 * hexes and the full content result (treasure and convey) for each hex.
 */
function calcHexesDetailedContentWithDetails(
  rollFn: (faces: number) => number = d
): {
  hexesDetailed: HexesDetailed;
  contents: { [key: number]: ReturnType<typeof calcContentWithPath> };
} {
  const { hexesDetailed, contents } = calcHexesDetailedContentWithRolls(rollFn);
  return { hexesDetailed, contents };
}

function calcHexesDetailedContentWithRolls(
  rollFn: (faces: number) => number = d
): {
  hexesDetailed: HexesDetailed;
  contents: { [key: number]: ReturnType<typeof calcContentWithPath> };
  rolls: ContentPatchRolls;
} {
  const hexesDetailed: HexesDetailed = {};
  const contents: { [key: number]: ReturnType<typeof calcContentWithPath> } =
    {};
  const rolls: ContentPatchRolls = {};

  const add = (hexNum: number) => {
    const generated = calcContentWithRolls(rollFn);
    contents[hexNum] = generated.content;
    hexesDetailed[hexNum] = generated.content.path;
    rolls[hexNum] = generated.rolls;
  };

  add(1);
  for (const item of currHexNextHex) {
    add(item.next);
  }

  return { hexesDetailed, contents, rolls };
}

function contentPatchFromRolls(rolls: ContentPatchRolls): {
  hexesDetailed: HexesDetailed;
  contents: { [key: number]: ReturnType<typeof calcContentWithPath> };
} {
  const entries = Object.entries(rolls);
  if (entries.length !== 19) {
    throw new Error('Expected exactly 19 content roll entries.');
  }

  const hexesDetailed: HexesDetailed = {};
  const contents: { [key: number]: ReturnType<typeof calcContentWithPath> } = {};
  const seenHexes = new Set<number>();
  for (const [hex, resultRolls] of entries) {
    const hexNumber = Number(hex);
    if (!Number.isInteger(hexNumber) || hexNumber < 1 || hexNumber > 19) {
      throw new Error(`Invalid hex number: ${hex}.`);
    }
    if (seenHexes.has(hexNumber)) {
      throw new Error(`Duplicate hex number: ${hex}.`);
    }
    seenHexes.add(hexNumber);
    if (
      typeof resultRolls !== 'object' ||
      resultRolls === null ||
      !Array.isArray(resultRolls.pathRolls) ||
      !resultRolls.pathRolls.every((roll) => Number.isInteger(roll))
    ) {
      throw new Error(`Content rolls for hex ${hex} must be an array of integers.`);
    }
    const content = contentFromRolls(resultRolls);
    hexesDetailed[hexNumber] = content.path;
    contents[hexNumber] = content;
  }
  return { hexesDetailed, contents };
}

function contentFromRolls(rolls: ContentRolls): ReturnType<typeof calcContentWithPath> {
  const path = contentPathFromRolls(tableContent, rolls.pathRolls);
  const type = path[0];
  const detail = path.length > 1 ? path.slice(1).join(': ') : null;
  const chance = tableContentTreasureChance.options[type] ?? null;

  if (chance === null) {
    if (rolls.treasureRoll !== null || rolls.conveyRoll !== null) {
      throw new Error('Special content must not include treasure or convey rolls.');
    }
  } else if (
    !Number.isInteger(rolls.treasureRoll) ||
    rolls.treasureRoll! < 1 ||
    rolls.treasureRoll! > 100
  ) {
    throw new Error('Content treasure rolls must be integers from 1 to 100.');
  }

  let convey: { roll: number; result: string } | null = null;
  if (type === 'Empty') {
    if (
      !Number.isInteger(rolls.conveyRoll) ||
      rolls.conveyRoll! < 1 ||
      rolls.conveyRoll! > 6
    ) {
      throw new Error('Empty content must include a convey roll from 1 to 6.');
    }
    const result = tableContentConvey.options[rolls.conveyRoll!];
    if (typeof result !== 'string') {
      throw new Error(`Invalid convey roll: ${rolls.conveyRoll}.`);
    }
    convey = { roll: rolls.conveyRoll!, result };
  } else if (rolls.conveyRoll !== null) {
    throw new Error('Only empty content may include a convey roll.');
  }

  return {
    path,
    type,
    detail,
    treasure: {
      chance,
      roll: rolls.treasureRoll,
      hasTreasure:
        chance === null || rolls.treasureRoll === null
          ? null
          : rolls.treasureRoll <= chance * 100,
    },
    convey,
  };
}

function contentPathFromRolls(table: RandomTable, rolls: number[]): string[] {
  const [roll, ...remainingRolls] = rolls;
  if (!Number.isInteger(roll) || !Object.hasOwn(table.options, roll)) {
    throw new Error(`Invalid roll ${String(roll)} for table "${table.title}".`);
  }
  const option = table.options[roll];
  if (typeof option === 'string') {
    if (remainingRolls.length > 0) {
      throw new Error(`Unexpected extra rolls for table "${table.title}".`);
    }
    return [option];
  }
  if (remainingRolls.length === 0) {
    throw new Error(`Missing roll for table "${option.nextTable.title}".`);
  }
  return [option.text, ...contentPathFromRolls(option.nextTable, remainingRolls)];
}

function resolveContentPathWithRolls(
  table: RandomTable,
  rollFn: (faces: number) => number
): { path: string[]; rolls: number[] } {
  const entry = randomOptionEntry(table, rollFn);
  const option = table.options[entry.roll];
  if (typeof option === 'string') {
    return { path: [option], rolls: [entry.roll] };
  }
  const nested = resolveContentPathWithRolls(option.nextTable, rollFn);
  return {
    path: [option.text, ...nested.path],
    rolls: [entry.roll, ...nested.rolls],
  };
}

export {
  calcContent,
  calcContentWithPath,
  calcContentWithRolls,
  calcHexesDetailedContentWithRolls,
  calcHexesDetailedContentWithDetails,
  contentPatchFromRolls,
  resolveContentDetail,
  resolveContentPath,
  type ContentPatchRolls,
  type ContentRolls,
};
