import { UUID } from "./util";

// Value option types
export type Day = "Mon" | "Tue" | "Wed" | "Thur" | "Fri" | "Sat" | "Sun";
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
type YesNo = "Yes" | "No" | "Unknown";
type EntryValue = {
  question: string;
  type: QuestionType;
  answer: string; //should be of any kind;
}[];

type Entries = Question[];

// Question Answer Value types
type StringValue = { value: string };
type CheckboxValue = { value: Record<string, boolean> };
type DateTimeValue = { value: Date };
type DaysValue = { value: Day[] };
type MultipleValue = { value: string[] };
type PersonValue = { value: Person[] };
type TimeValue = { value: Time };
type YesNoValue = { value: YesNo };
type CollectionValue = { value: EntryValue[] };

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

// Answer by Question Type
type DefaultAnswer = {
  comment: string;
};
type StringAnswer = { answer: DefaultAnswer & StringValue };
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

export type CheckboxQuestion = StringValueQuestion &
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

export type ListQuestion = StringValueQuestion & {
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
  | "yes/no"
  | "collection";

type BaseQuestion = {
  id: UUID;
  hasComment: boolean;
  displayValue: string;
  hasDrawing: boolean;
  hasFile: boolean;
  question: string;
  sub1: string;
  type: QuestionType;
};

export type Process = Question;

export type Questions = Question[];

export type Processes = Questions;
