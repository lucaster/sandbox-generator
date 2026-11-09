import { d } from '../dice/dice';
import { Options, OptionWithFollowUp, type RandomTable } from '../domain/random-table';
import { tableNextHexBiome, tableStartingHexBiome } from './biome-tables';
import { tableContent } from './content-tables';
import { tableNextHexFeature, tableStartingHexFeature } from './feature-tables';

const optionAndImagePath: { [option: string]: string } = {
  // Biome
  'Grassland': '/assets/images/grassland.png',
  'Forest': '/assets/images/forest.png',
  'Hills': '/assets/images/hills.png',
  'Marsh': '/assets/images/marsh.png',
  'Mountains': '/assets/images/mountains.png',
  // Landmarks
  'Landmark': '/assets/images/landmark.png',
  // Settlement
  'Hamlet': '/assets/images/hamlet.png',
  'Village': '/assets/images/village.png',
  'City': '/assets/images/city.png',
  'Castle': '/assets/images/castle.png',
  'Tower': '/assets/images/tower.png',
  'Abbey': '/assets/images/abbey.png',
  // Lair
  'Lair': '/assets/images/lair.png',
  // Dungeon
  'Dungeon': '/assets/images/dungeon.png',
};

function optionToImagePath(option: string): string {
  const result = optionAndImagePath[option];
  return result;
}

function optionsToImagePath(options: string[]): string {
  // from more specific to less specific:
  for (let i = options.length - 1; i >= 0; i--) {
    const imagePath = optionToImagePath(options[i]);
    if (imagePath) {
      return imagePath;
    }
  }
  return '';
};

function calcStartingHexBiome(
  rollFn: (faces: number) => number = d
): string {
  return calcStartingHex(
    tableStartingHexBiome,
    rollFn
  );
}

type FeaturePatchWithRolls = {
  hexesDetailed: HexesDetailed;
  rolls: HexRollSequences;
};

function calcHexesDetailedFeatureWithRolls(
  rollFn: (faces: number) => number = d
): FeaturePatchWithRolls {
  const hexesDetailed: HexesDetailed = {
    1: ['Village'],
    2: ['Dungeon'],
  };
  // Store the table results for these fixed features as well: Village is 1
  // on the starting table and Dungeon is 6 on the next-feature table.
  const rolls: HexRollSequences = {
    1: [1],
    2: [6],
  };
  for (const { next: hex } of currHexNextHex) {
    if (hex === 2) {
      continue;
    }
    const result = calcHexPathWithRolls(tableNextHexFeature, rollFn);
    hexesDetailed[hex] = result.details;
    rolls[hex] = result.rolls;
  }
  return { hexesDetailed, rolls };
}

function hexesDetailedFeatureFromRolls(rolls: HexRollSequences): HexesDetailed {
  const entries = Object.entries(rolls);
  if (entries.length !== 19) {
    throw new Error('Expected exactly 19 feature roll sequences.');
  }
  for (const [hex, sequence] of entries) {
    const hexNumber = Number(hex);
    if (!Number.isInteger(hexNumber) || hexNumber < 1 || hexNumber > 19) {
      throw new Error(`Invalid hex number: ${hex}.`);
    }
    if (
      !Array.isArray(sequence) ||
      sequence.length === 0 ||
      !sequence.every((roll) => Number.isInteger(roll))
    ) {
      throw new Error(`Feature rolls for hex ${hex} must be a non-empty array of integers.`);
    }
  }
  if (rolls[1].length !== 1 || rolls[1][0] !== 1) {
    throw new Error('Hex 1 must contain the fixed Village result [1].');
  }
  if (rolls[2].length !== 1 || rolls[2][0] !== 6) {
    throw new Error('Hex 2 must contain the fixed Dungeon result [6].');
  }

  const result: HexesDetailed = {
    1: ['Village'],
    2: ['Dungeon'],
  };
  for (let hex = 3; hex <= 19; hex++) {
    result[hex] = featurePathFromRolls(tableNextHexFeature, rolls[hex]);
  }
  return result;
}

function calcHexPathWithRolls(
  table: RandomTable,
  rollFn: (faces: number) => number
): { details: string[]; rolls: number[] } {
  const roll = randomKey(table.options, table.dice, rollFn);
  const option = table.options[roll];
  if (typeof option === 'string') {
    return { details: [option], rolls: [roll] };
  }
  const nested = calcHexPathWithRolls(option.nextTable, rollFn);
  return {
    details: [option.text, ...nested.details],
    rolls: [roll, ...nested.rolls],
  };
}

function featurePathFromRolls(table: RandomTable, rolls: number[]): string[] {
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
  return [option.text, ...featurePathFromRolls(option.nextTable, remainingRolls)];
}

function calcStartingHexFeature(
  rollFn: (faces: number) => number = d
): string {
  return calcStartingHex(
    tableStartingHexFeature,
    rollFn
  );
}

function calcStartingHex(
  table: RandomTable,
  rollFn: (faces: number) => number = d
): string {
  return calcHexRecursively(table, rollFn);
}

function calcNextHexBiome(
  previousHex: string,
  rollFn: (faces: number) => number = d
): string {
  return calcNextHexDependentFromPrevious(
    previousHex,
    tableNextHexBiome,
    rollFn
  );
}

function calcNextHexFeature(
  rollFn: (faces: number) => number = d
): string | OptionWithFollowUp {
  return calcNextHexIndependentFromPreviews(
    tableNextHexFeature,
    rollFn
  );
}

function calcNextHexDependentFromPrevious(
  previousHex: string,
  nextHexTable: RandomTable,
  rollFn: (faces: number) => number = d
): string {
  // 50% chance to stay the same
  const rolled = rollFn(10);
  if (rolled <= 5) {
    return previousHex;
  }
  else {
    const next = nextHexTable.options[rolled];
    if (typeof next === 'string') {
      return next;
    }
    else {
      return calcHexRecursively(next.nextTable!, rollFn);
    }
  }
}

function calcNextHexIndependentFromPreviews(
  nextHexTable: RandomTable,
  rollFn: (faces: number) => number = d
): string {
  return calcHexRecursively(nextHexTable, rollFn);
}

const currHexNextHex = [
  { cur: 1, next: 2 },
  { cur: 1, next: 3 },
  { cur: 1, next: 4 },
  { cur: 1, next: 5 },
  { cur: 1, next: 6 },
  { cur: 1, next: 7 },
  { cur: 2, next: 8 },
  { cur: 3, next: 10 },
  { cur: 4, next: 12 },
  { cur: 5, next: 14 },
  { cur: 6, next: 16 },
  { cur: 7, next: 18 },
  { cur: 8, next: 9 },
  { cur: 10, next: 11 },
  { cur: 12, next: 13 },
  { cur: 14, next: 15 },
  { cur: 16, next: 17 },
  { cur: 18, next: 19 },
];

type Hexes = { [key: number]: string; };
type HexesDetailed = { [key: number]: string[]; };
type HexRolls = { [key: number]: number; };
type HexRollSequences = { [key: number]: number[]; };

// The 2023 edition fixes the first two hexes for a traditional campaign:
// hex 1 contains a village and hex 2 a dungeon (p. 11).
const fixedStartingFeatures: HexesDetailed = {
  1: ['Village'],
  2: ['Dungeon'],
};

function calcHexesBiome(
  rollFn: (faces: number) => number = d
): Hexes {
  return calcHexesBiomeWithRolls(rollFn).biomes;
}

function calcHexesBiomeWithRolls(
  rollFn: (faces: number) => number = d
): { biomes: Hexes; rolls: HexRolls } {
  const first = randomOptionEntry(tableStartingHexBiome, rollFn);
  const biomes: Hexes = { 1: first.result };
  const rolls: HexRolls = { 1: first.roll };
  for (const item of currHexNextHex) {
    const roll = rollFn(10);
    rolls[item.next] = roll;
    biomes[item.next] =
      roll <= 5 ? biomes[item.cur] : (tableNextHexBiome.options[roll] as string);
  }
  return { biomes, rolls };
}

function hexesBiomeFromRolls(rolls: HexRolls): Hexes {
  const result: Hexes = {};
  const entries = Object.entries(rolls);
  if (entries.length !== 19) {
    throw new Error('Expected exactly 19 biome rolls.');
  }
  for (const [hex, roll] of entries) {
    const hexNumber = Number(hex);
    if (!Number.isInteger(hexNumber) || hexNumber < 1 || hexNumber > 19) {
      throw new Error(`Invalid hex number: ${hex}.`);
    }
    if (!Number.isInteger(roll) || roll < 1 || roll > 10) {
      throw new Error(`Invalid biome roll for hex ${hex}.`);
    }
  }

  result[1] = tableStartingHexBiome.options[rolls[1]] as string;
  for (const item of currHexNextHex) {
    const roll = rolls[item.next];
    result[item.next] =
      roll <= 5 ? result[item.cur] : (tableNextHexBiome.options[roll] as string);
  }
  return result;
}

function calcHexesFeature(
  rollFn: (faces: number) => number = d
): Hexes {
  return calcHexes(
    tableStartingHexFeature,
    tableNextHexFeature,
    rollFn,
    fixedStartingFeatures
  );
}

function calcHexesDetailedFeature(
  rollFn: (faces: number) => number = d
): HexesDetailed {
  return calcHexesDetailed(
    tableStartingHexFeature,
    tableNextHexFeature,
    rollFn,
    fixedStartingFeatures
  );
}

function calcHexesContent(
  rollFn: (faces: number) => number = d
): Hexes {
  return calcHexes(
    tableContent,
    tableContent,
    rollFn
  );
}

function calcHexesDetailedContent(
  rollFn: (faces: number) => number = d
): HexesDetailed {
  return calcHexesDetailed(
    tableContent,
    tableContent,
    rollFn
  );
}

function calcHexes(
  tableStartingHex: RandomTable,
  tableNextHex: RandomTable,
  rollFn: (faces: number) => number,
  fixedHexes: HexesDetailed = {}
): Hexes {
  var hexesDetailed = calcHexesDetailed(
    tableStartingHex,
    tableNextHex,
    rollFn,
    fixedHexes
  );
  var hexes = fromHexesDetailedToHexes(hexesDetailed);
  return hexes;
}

function fromHexesDetailedToHexes(hexesDetailed: HexesDetailed): Hexes {
  const result: Hexes = {};
  for (const key in hexesDetailed) {
    const arr = hexesDetailed[key];
    result[Number(key)] = arr[arr.length - 1];
  }
  return result;
}

function fromHexesDetailedToImagePathHexes(hexesDetailed: HexesDetailed): Hexes {
  const result: Hexes = {};
  for (const key in hexesDetailed) {
    const arr = hexesDetailed[key];
    const imagePath = optionsToImagePath(arr);
    result[Number(key)] = imagePath;
  }
  return result;
}

function fromHexesToHexesDetailed(hexes: Hexes): HexesDetailed {
  const result: HexesDetailed = {};
  for (const key in hexes) {
    result[Number(key)] = [hexes[key]];
  }
  return result;
}

function calcHexesDetailed(
  tableStartingHex: RandomTable,
  tableNextHex: RandomTable,
  rollFn: (faces: number) => number = d,
  fixedHexes: HexesDetailed = {}
): HexesDetailed {
  const result: HexesDetailed = {
    1: fixedHexes[1] ?? calcHexPathRecursivelyRec([], tableStartingHex, rollFn),
  }
  for (const item of currHexNextHex) {
    result[item.next] =
      fixedHexes[item.next] ??
      calcHexPathRecursivelyRec([], tableNextHex, rollFn);
  }
  return result;
}

function calcHexRecursively(
  table: RandomTable,
  rollFn: (faces: number) => number = d
): string {
  var arr = calcHexPathRecursivelyRec([], table, rollFn);
  return arr[arr.length - 1];
}

function calcHexPathRecursivelyRec(
  curr: string[],
  table: RandomTable,
  rollFn: (faces: number) => number = d
): string[] {
  const result = randomOption(table, rollFn);
  if (typeof result === 'string') {
    return [...curr, result];
  }
  else {
    return calcHexPathRecursivelyRec([...curr, result.text], result.nextTable!, rollFn);
  }
}

function rollDice(
  dice: string,
  rollFn: (faces: number) => number
): number {
  const [count, faces] = dice.split('d').map(Number);
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += rollFn(faces);
  }
  return total;
}

function randomKey(
  options: Options,
  dice: string | undefined,
  rollFn: (faces: number) => number = d
): number {
  const keys = Object.keys(options).map(Number);
  const min = Math.min(...keys);
  const max = Math.max(...keys);
  const rolled = dice ? rollDice(dice, rollFn) : rollFn(max);
  return Math.min(Math.max(rolled, min), max);
}

function randomOption(
  table: RandomTable,
  rollFn: (faces: number) => number = d
): string | OptionWithFollowUp {
  const key = randomKey(table.options, table.dice, rollFn);
  const result = table.options[key];
  return result;
}

function randomOptionEntry(
  table: RandomTable,
  rollFn: (faces: number) => number = d
) {
  const options = table.options;
  const key = randomKey(options, table.dice, rollFn);
  const result = options[key];
  return {
    roll: key,
    result: result as string,
  };
}

function oppositeOptionEntry(roll: number, table: RandomTable) {
  const keys = Object.keys(table.options).map(Number).sort((a, b) => a - b);
  const keyIndex = keys.indexOf(roll);
  const oppositeKey = keys[keys.length - 1 - keyIndex];
  const oppositeResult = table.options[oppositeKey];
  return {
    roll: oppositeKey,
    result: oppositeResult,
  };
}

export {
  calcHexesBiome,
  calcHexesBiomeWithRolls,
  calcHexesContent,
  calcHexesDetailed,
  calcHexesDetailedContent,
  calcHexesDetailedFeature,
  calcHexesDetailedFeatureWithRolls,
  calcHexesFeature,
  calcNextHexBiome,
  calcNextHexFeature,
  calcStartingHexBiome,
  calcStartingHexFeature,
  currHexNextHex,
  fromHexesDetailedToHexes,
  fromHexesDetailedToImagePathHexes,
  fromHexesToHexesDetailed,
  hexesBiomeFromRolls,
  hexesDetailedFeatureFromRolls,
  oppositeOptionEntry,
  optionsToImagePath,
  optionToImagePath,
  randomOption,
  randomOptionEntry,
  type Hexes,
  type HexesDetailed,
  type HexRolls,
  type HexRollSequences
};
