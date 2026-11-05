
type RandomTable = {
  id: number;
  title: string;
  dice?: string; // '1d6', '2d6', '1d20', ...
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

