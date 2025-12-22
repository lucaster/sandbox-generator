
type RandomTable = {
  id: number;
  title: string;
  options: Options;
};

type Options = {
  [key: number]: string | OptionWithFollowUp;
};

type OptionWithFollowUp = {
  text: string;
  nextTable: RandomTable;
};

// ... your existing code ...

export { type Options, type OptionWithFollowUp, type RandomTable };

