
type Question = {
  id: number;
  title: string;
  options: Options;
};

type Options = {
  [key: number]: string | OptionWithFollowUp;
};

type OptionWithFollowUp = {
  text: string;
  nextQuestion?: Options;
};

// ... your existing code ...

export { type Options, type OptionWithFollowUp, type Question };

