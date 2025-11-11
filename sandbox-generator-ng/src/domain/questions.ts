type OptionWithFollowUp = {
  text: string;
  nextQuestion?: Question;
};

type Question = {
  [key: number]: string | OptionWithFollowUp;
};

const q1: Question = {
  1: 'a',
  2: 'b',
  3: 'c',
};

const q1_3: Question = {
  1: 'd',
  2: 'e',
};

(q1[4] as OptionWithFollowUp).nextQuestion = q1_3;

// ... your existing code ...

export type { OptionWithFollowUp, Question };
export { q1, q1_3 };
