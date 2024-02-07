// Value option types
export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
export type Salutation = "Mr" | "Ms" | undefined;
export type Person = {
  salut: Salutation;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};
type Time = {
  fromTime: string;
  toTime: string;
};
export type YesNo = "Yes" | "No" | "Unknown";
// type QuestionCollectionAnswer<T> = Extract<Extract<Question, { type: T }>,  'answer'>;
// export type EntryAnswer<T> = {
//   question: string;
//   type: T;
//   answer: QuestionCollectionAnswer<T>
// };
// export type EntryAnswers = EntryAnswer<QuestionType>[];

export type EntryAnswers = Question[];

export type Entries = Exclude<Question, "CollectionQuestion">[];

// Question Answer Value types
type StringValue = { value?: string };
type StringOrNullValue = { value?: string | null };
type CheckboxValue = { value?: Record<string, boolean> };
type DateTimeValue = { value?: Date };
type DaysValue = { value?: number[] };
type MultipleValue = { value?: string[] };
type PersonValue = { value?: Person[] };
type TimeValue = { value?: Time };
type YesNoValue = { value?: YesNo };
type CollectionValue = { value?: EntryAnswers[] };

export type QuestionValue =
  | StringValue
  | CheckboxValue
  | DateTimeValue
  | DaysValue
  | MultipleValue
  | PersonValue
  | TimeValue
  | YesNoValue
  | CollectionValue;

export type ValueByQuestionType<T extends Question> = T["answer"]["value"];

// Answer by Question Type
type DefaultAnswer = {
  comment: string;
};
type StringAnswer = { answer: DefaultAnswer & StringValue };
type StringOrNullAnswer = { answer: DefaultAnswer & StringOrNullValue };
type CheckboxAnswer = { answer: DefaultAnswer & CheckboxValue };
type DateTimeAnswer = { answer: DefaultAnswer & DateTimeValue };
type DaysAnswer = { answer: DefaultAnswer & DaysValue };
type MultipleAnswer = { answer: DefaultAnswer & MultipleValue };
type PersonAnswer = { answer: DefaultAnswer & PersonValue };
type TimeAnswer = { answer: DefaultAnswer & TimeValue };
type YesNoAnswer = { answer: DefaultAnswer & YesNoValue };
type CollectionAnswer = { answer: DefaultAnswer & CollectionValue };

// Question by Type
export type StringValueQuestion = BaseQuestion & StringAnswer;
export type StringOrNullValueQuestion = BaseQuestion & StringOrNullAnswer;

export type CheckboxQuestion = BaseQuestion &
  CheckboxAnswer & {
    type: "checkbox";
    listOptions: ListOptions;
  };

export type EmailQuestion = StringValueQuestion & {
  type: "email";
};

export type GeoQuestion = StringValueQuestion & {
  type: "geo";
};

export type NumberQuestion = StringValueQuestion & {
  type: "number";
};

export type PhoneQuestion = StringValueQuestion & {
  type: "phone";
};

export type TextQuestion = StringValueQuestion & {
  type: "text";
};

export type ListQuestion = StringOrNullValueQuestion & {
  type: "list";
  listOptions: ListOptions;
};

export type DateTimeQuestion = BaseQuestion &
  DateTimeAnswer & {
    type: "datetime";
  };

export type DaysQuestion = BaseQuestion &
  DaysAnswer & {
    type: "days";
  };

export type MultipleQuestion = BaseQuestion &
  MultipleAnswer & {
    type: "multiple";
    listOptions: ListOptions;
  };

export type PersonQuestion = BaseQuestion &
  PersonAnswer & {
    type: "person";
  };

export type TimeQuestion = BaseQuestion &
  TimeAnswer & {
    type: "time";
  };

export type YesNoQuestion = BaseQuestion &
  YesNoAnswer & {
    type: "yes/no";
  };

export type CollectionQuestion = BaseQuestion &
  CollectionAnswer & {
    type: "collection";
    entries: Entries;
  };

export type Question =
  | CheckboxQuestion
  | EmailQuestion
  | GeoQuestion
  | NumberQuestion
  | PhoneQuestion
  | TextQuestion
  | ListQuestion
  | DateTimeQuestion
  | DaysQuestion
  | MultipleQuestion
  | PersonQuestion
  | TimeQuestion
  | YesNoQuestion
  | CollectionQuestion;

// Answer types
type ListOptions = string[];

export type QuestionType =
  | "checkbox"
  | "collection"
  | "datetime"
  | "days"
  | "email"
  | "geo"
  | "list"
  | "multiple"
  | "number"
  | "person"
  | "phone"
  | "text"
  | "time"
  | "yes/no";

type BaseQuestion = {
  id?: number;
  hasComment?: boolean;
  displayValue?: string;
  hasDrawing?: boolean;
  hasFile?: boolean;
  question: string;
  sub1?: string;
  type: QuestionType;
};

export type Process = Question;

export type Questions = Question[];

export type Processes = Questions;

export type QuestionByType<T> = Extract<Question, T>;
export type QuestionValueByType<T> = QuestionByType<T>["answer"]["value"];

export type ProcessByType<T> = QuestionByType<T>;
