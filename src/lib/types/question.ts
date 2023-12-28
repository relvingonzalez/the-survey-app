import { UUID } from "./util";

type Answer = {
  comment: string;
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
  answer: Answer;
  hasComment: boolean;
  displayValue: string;
  hasDrawing: boolean;
  hasFile: boolean;
  question: string;
  sub1: string;
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
