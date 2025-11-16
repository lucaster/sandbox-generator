import { keyNum } from '../app/utils/object-utils';
import { d } from '../dice/dice';
import { Options, OptionWithFollowUp, type Question } from '../domain/questions';

const tableStartingHex: Question = {
  id: 0,
  title: 'Starting Hex Terrain',
  options: {
    1: 'Grassland',
    2: 'Grassland',
    3: 'Grassland',
    4: 'Grassland',
    5: 'Forest',
    6: 'Forest',
    7: 'Hills',
    8: 'Hills',
    9: 'Marsh',
    10: 'Mountains',
  },
};

function calcStartingHex(rollFn: (faces: number) => number = d): string {
  const faces: number = keyNum(tableStartingHex.options);
  const key: number = rollFn(faces);
  const result = tableStartingHex.options[key];
  if (typeof result === 'string') {
    return result;
  }
  return result.text;
}

const tableNextHex: Question = {
  id: 1,
  title: 'Next Hex Terrain',
  options: {
    1: 'Same as previous hex',
    2: 'Same as previous hex',
    3: 'Same as previous hex',
    4: 'Same as previous hex',
    5: 'Same as previous hex',
    6: 'Grassland',
    7: 'Forest',
    8: 'Hills',
    9: 'Marsh',
    10: 'Mountains',
  },
};

// accept a roll function so tests can supply deterministic values
function calcNextHex(previousHex: string, rollFn: (faces: number) => number = d): string {
  const rolled = rollFn(10);
  if (rolled <= 5) {
    const nextHex = previousHex;
    console.info(`${previousHex} -> ${rolled} -> ${nextHex} (same)`);
    return nextHex;
  }
  else {
    const nextHex = tableNextHex.options[rolled];
    console.info(`${previousHex} -> ${rolled} -> ${nextHex}`);
    return nextHex as string;
  }
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
];

function calcHexes(rollFn: (faces: number) => number = d): { [key: number]: string } {
  const result: { [key: number]: string } = {
    1: calcStartingHex(),
  }
  for (const item of currHexNextHex) {
    const nextHexResult = calcNextHex(result[item.cur], rollFn);
    result[item.next] = nextHexResult;
    console.info(`${item.cur} -> ${item.next} : ${result[item.cur]} -> ${result[item.next]}`);
  }
  return result;
}

function randomOption(options: Options): string | OptionWithFollowUp {
  const faces: number = keyNum(options);
  const key: number = d(faces);
  const result = options[key];
  return result;
}

export {
  tableStartingHex,
  calcStartingHex,
  tableNextHex,
  calcNextHex,
  calcHexes,
  randomOption,
};
