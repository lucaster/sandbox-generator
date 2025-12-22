import { keyNum } from '../app/utils/object-utils';
import { d } from '../dice/dice';
import { Options, OptionWithFollowUp, type RandomTable } from '../domain/random-table';
import { tableNextHexBiome, tableNextHexFeature, tableStartingHexBiome, tableStartingHexFeature } from './random-tables';

function biomeToImagePath(biome: string): string {
  switch (biome) {
    case 'Grassland':
      return '/assets/images/grassland.png';
    case 'Forest':
      return '/assets/images/forest.png';
    case 'Hills':
      return '/assets/images/hills.png';
    case 'Marsh':
      return '/assets/images/marsh.png';
    case 'Mountains':
      return '/assets/images/mountains.png';
    default:
      return '/assets/images/grassland.png';
  }
}

function calcStartingHexBiome(
  rollFn: (faces: number) => number = d
): string {
  return calcStartingHex(
    tableStartingHexBiome,
    rollFn
  );
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
  const result = randomOption(table.options, rollFn);
  if (typeof result === 'string') {
    return result;
  }
  return result.text;
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
  table: RandomTable,
  rollFn: (faces: number) => number = d
): string {
  // 50% chance to stay the same
  const rolled = rollFn(10);
  if (rolled <= 5) {
    const nextHex = previousHex;
    console.info(`${previousHex} -> ${rolled} -> ${nextHex} (same)`);
    return nextHex;
  }
  else {
    const nextHex = table.options[rolled];
    console.info(`${previousHex} -> ${rolled} -> ${nextHex}`);
    return nextHex as string;
  }
}

function calcNextHexIndependentFromPreviews(
  table: RandomTable,
  rollFn: (faces: number) => number = d
): string | OptionWithFollowUp {
  return randomOption(table.options, rollFn);
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

function calcHexesBiome(
  rollFn: (faces: number) => number = d
): Hexes {
  return calcHexes(
    tableStartingHexBiome,
    tableNextHexBiome,
    rollFn,
  );
}

function calcHexesFeature(
  rollFn: (faces: number) => number = d
): Hexes {
  return calcHexes(
    tableStartingHexFeature,
    tableNextHexFeature,
    rollFn,
  );
}

function calcHexes(
  tableStartingHex: RandomTable,
  tableNextHex: RandomTable,
  rollFn: (faces: number) => number = d,
): Hexes {
  var calcStartingHexFn = () => calcStartingHex(tableStartingHex, rollFn);
  var calcNextHexFn = (previousHex: string) => calcNextHexDependentFromPrevious(previousHex, tableNextHex, rollFn);
  const result: Hexes = {
    1: calcStartingHexFn(),
  };
  for (const item of currHexNextHex) {
    const nextHexResult = calcNextHexFn(result[item.cur]);
    result[item.next] = nextHexResult;
    console.info(`${item.cur} -> ${item.next} : ${result[item.cur]} -> ${result[item.next]}`);
  }
  return result;
}

function randomOption(
  options: Options,
  rollFn: (faces: number) => number = d
): string | OptionWithFollowUp {
  const faces: number = keyNum(options);
  const key: number = rollFn(faces);
  const result = options[key];
  return result;
}

function calcHexRecursively(
  table: RandomTable,
  rollFn: (faces: number) => number = d
): string {
  const result = randomOption(table.options, rollFn);
  if (typeof result === 'string') {
    return result;
  }
  else {
    return calcHexRecursively(result.nextTable!, rollFn);
  }
}

export {
  biomeToImagePath,
  calcHexesBiome,
  calcHexesFeature,
  calcNextHexBiome,
  calcNextHexFeature,
  calcStartingHexBiome,
  calcStartingHexFeature,
  type Hexes
};

