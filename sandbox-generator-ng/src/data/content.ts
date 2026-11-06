import { d } from '../dice/dice';
import { RandomTable } from '../domain/random-table';
import { randomOptionEntry } from './data';
import {
  tableContent,
  tableContentConvey,
  tableContentTreasureChance,
} from './random-tables';

/**
 * Follows a content table's nested tables and joins the path with ": ".
 * For example, "Related to landmark: Uncover a mystery: Curse".
 */
function resolveContentDetail(
  table: RandomTable,
  rollFn: (faces: number) => number
): string {
  const entry = randomOptionEntry(table, rollFn);
  const option = table.options[entry.key];
  if (typeof option === 'string') {
    return option;
  }
  return `${option.text}: ${resolveContentDetail(option.nextTable, rollFn)}`;
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
  const content = randomOptionEntry(tableContent, rollFn);
  const option = tableContent.options[content.key];
  const type = typeof option === 'string' ? option : option.text;
  const detail =
    typeof option === 'string'
      ? null
      : resolveContentDetail(option.nextTable, rollFn);

  const chance = tableContentTreasureChance.options[type] ?? null;
  const treasureRoll = chance === null ? null : rollFn(100);
  const hasTreasure =
    chance === null || treasureRoll === null
      ? null
      : treasureRoll <= chance * 100;

  return {
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

export { calcContent, resolveContentDetail };
