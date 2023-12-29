import { UUID } from "./util";

type Answer = {
  comment: string;
  value: string;
};

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
  type: "collection";
  entries: QuestionEntry[];
};

type DefaultQuestion = BaseQuestion & {
  type: Omit<QuestionType, "collection">;
};

export type Question = CollectionQuestion | DefaultQuestion;

export type Process = Question;

export type Questions = Question[];

export type Processes = Questions;
