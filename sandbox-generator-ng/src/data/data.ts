import { keyNum } from '../app/utils/object-utils';
import { d } from '../dice/dice';
import { Options, OptionWithFollowUp, type RandomTable } from '../domain/random-table';
import { tableNextHexBiome, tableNextHexFeature, tableStartingHexBiome, tableStartingHexFeature } from './random-tables';

function optionToImagePath(option: string): string {
  const optionToImagePath: { [option: string]: string } = {
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
  const result = optionToImagePath[option];
  return result;
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

function calcHexesBiome(
  rollFn: (faces: number) => number = d
): Hexes {
  const result: Hexes = {
    1: calcStartingHexBiome(),
  };
  for (const item of currHexNextHex) {
    const nextHexResult = calcNextHexBiome(result[item.cur], rollFn);
    result[item.next] = nextHexResult;
    console.info(`${item.cur} -> ${item.next} : ${result[item.cur]} -> ${result[item.next]}`);
  }
  return result;
}

function calcHexesFeature(
  rollFn: (faces: number) => number = d
): Hexes {
  var calcStartingHexFn = () => calcStartingHex(tableStartingHexFeature, rollFn);
  var calcNextHexFn = (previousHex: string) => calcNextHexIndependentFromPreviews(tableNextHexFeature, rollFn);
  const result: Hexes = {
    1: calcStartingHexFn(),
  }
  for (const item of currHexNextHex) {
    const nextHexResult = calcNextHexFn(result[item.cur]);
    result[item.next] = nextHexResult;
    console.info(`${item.cur} -> ${item.next} : ${result[item.cur]} -> ${result[item.next]}`);
  }
  return result;

  // return calcHexes(
  //   tableStartingHexFeature,
  //   tableNextHexFeature,
  //   rollFn,
  // );
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

function randomOption(
  options: Options,
  rollFn: (faces: number) => number = d
): string | OptionWithFollowUp {
  const faces: number = keyNum(options);
  const key: number = rollFn(faces);
  const result = options[key];
  return result;
}

export {
  calcHexesBiome,
  calcHexesFeature,
  calcNextHexBiome,
  calcNextHexFeature,
  calcStartingHexBiome,
  calcStartingHexFeature,
  optionToImagePath,
  type Hexes
};

