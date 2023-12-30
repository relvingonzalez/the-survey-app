import { UUID } from "./util";

type AnswerValue = string;
type BaseAnswer = {
  comment: string;
  value: AnswerValue;
};
type ListOptions = string[];
type ListAnswer = {
  comment: string;
  [key: string]: AnswerValue;
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
  answer: BaseAnswer;
};

type ListQuestionTypes = "list" | "checkbox" | "multiple";

type CollectionQuestion = BaseQuestion & {
  type: "collection";
  entries: QuestionEntry[];
  answer: ListAnswer;
};

type ListQuestion = BaseQuestion & {
  type: ListQuestionTypes;
  listOptions: ListOptions;
  answer: ListAnswer;
};

type DefaultQuestion = BaseQuestion & {
  type: Exclude<QuestionType, "collection" | ListQuestionTypes>;
  answer: BaseAnswer;
};

export type Question = CollectionQuestion | ListQuestion | DefaultQuestion;

export type Process = Question;

export type Questions = Question[];

export type Processes = Questions;
