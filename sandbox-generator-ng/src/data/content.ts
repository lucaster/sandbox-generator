import { d } from '../dice/dice';
import { RandomTable } from '../domain/random-table';
import { currHexNextHex, randomOptionEntry, type HexesDetailed } from './data';
import {
  tableContent,
  tableContentConvey,
  tableContentTreasureChance,
} from './random-tables';

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
  const path = resolveContentPath(tableContent, rollFn);
  const type = path[0];
  const detail = path.length > 1 ? path.slice(1).join(': ') : null;

  const chance = tableContentTreasureChance.options[type] ?? null;
  const treasureRoll = chance === null ? null : rollFn(100);
  const hasTreasure =
    chance === null || treasureRoll === null
      ? null
      : treasureRoll <= chance * 100;

  return {
    path,
    type,
    detail,
    treasure: {
      chance,
      roll: treasureRoll,
      hasTreasure,
    },
    convey:
      type === 'Empty' ? randomOptionEntry(tableContentConvey, rollFn) : null,
  };
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
  const hexesDetailed: HexesDetailed = {};
  const contents: { [key: number]: ReturnType<typeof calcContentWithPath> } =
    {};

  const add = (hexNum: number) => {
    const content = calcContentWithPath(rollFn);
    contents[hexNum] = content;
    hexesDetailed[hexNum] = content.path;
  };

  add(1);
  for (const item of currHexNextHex) {
    add(item.next);
  }

  return { hexesDetailed, contents };
}

export {
  calcContent,
  calcContentWithPath,
  calcHexesDetailedContentWithDetails,
  resolveContentDetail,
  resolveContentPath,
};
