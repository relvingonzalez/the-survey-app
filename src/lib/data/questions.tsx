import {
  Question,
  QuestionType,
  Questions,
  TextQuestion,
} from "../types/question";
import { UUID } from "../types/util";

export const dummyQuestion: TextQuestion = {
  id: "1",
  question: "How hot is the Sun?",
  sub1: "The most important question",
  answer: {
    value: "Very hot",
    comment: "",
  },
  displayValue: "Very Hot",
  type: "text",
  hasDrawing: true,
  hasFile: true,
  hasComment: true,
};

export const dummyQuestion2: Question = {
  id: "2",
  question: "What is your phone?",
  sub1: "The most important question",
  answer: {
    value: "",
    comment: "",
  },
  displayValue: "1(333)444-5555",
  type: "phone",
  hasDrawing: false,
  hasFile: false,
  hasComment: false,
};

function createQuestion(
  id: UUID,
  type: QuestionType,
  question?: string,
  listOptions?: string[],
) {
  return Object.assign({}, dummyQuestion, {
    id,
    type,
    question,
    listOptions,
  });
}

export const dummyQuestions: Questions = [
  dummyQuestion,
  dummyQuestion2,
  createQuestion("3", "email", "Type your Email"),
  createQuestion("4", "list", "What is your favorite vacation spot?", [
    "Brazil",
    "Norway",
    "USA",
    "Denmark",
  ]),
  createQuestion("5", "checkbox", "Where have you looked?", [
    "under the bed",
    "Behind the counters",
    "under the sink",
  ]),
  createQuestion("6", "multiple", "What countries have you visited?", [
    "Brazil",
    "Norway",
    "USA",
    "Denmark",
  ]),
];
