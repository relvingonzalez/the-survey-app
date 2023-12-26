import { UUID } from "./util";

type Answer = {
  value: string;
};

export type QuestionType =
  | "CHECKBOX"
  | "DATETIME"
  | "DAYS"
  | "EMAIL"
  | "GEO"
  | "LIST"
  | "MULTIPLE"
  | "NUMBER"
  | "PERSON"
  | "PHONE"
  | "TEXT"
  | "TIME"
  | "YES/NO"
  | "COLLECTION";

type BaseQuestion = {
  id: UUID;
  sub1: string;
  question: string;
  answer: Answer;
  displayValue: string;
};

type QuestionEntry = {
  question: string;
  type: QuestionType;
  answer: Answer;
};

type CollectionQuestion = BaseQuestion & {
  type: "COLLECTION";
  entries: QuestionEntry[];
};

type DefaultQuestion = BaseQuestion & {
  type: Omit<QuestionType, "COLLECTION">;
};

export type Question = CollectionQuestion | DefaultQuestion;

export type Process = Question;

export type Questions = Question[];

export type Processes = Questions;
