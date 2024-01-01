import { Question, Questions, TextQuestion } from "../types/question";
import { UUID } from "../types/util";
import { createPerson } from "../utils/functions";

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

function createQuestion<QuestionType>(
  id: UUID,
  type: QuestionType,
  question?: string,
  others?: Partial<Extract<Question, { type: QuestionType }>>,
) {
  return Object.assign({}, dummyQuestion, {
    id,
    type,
    question,
    ...others,
  });
}

export const dummyQuestions: Questions = [
  dummyQuestion,
  dummyQuestion2,
  createQuestion("3", "email", "Type your Email"),
  createQuestion("4", "list", "What is your favorite vacation spot?", {
    listOptions: ["Brazil", "Norway", "USA", "Denmark"],
  }),
  createQuestion("5", "checkbox", "Where have you looked?", {
    listOptions: ["under the bed", "Behind the counters", "under the sink"],
  }),
  createQuestion("6", "multiple", "What countries have you visited?", {
    listOptions: ["Brazil", "Norway", "USA", "Denmark"],
    answer: {
      comment: "",
      value: [],
    },
  }),
  createQuestion("7", "geo", "Get your coordinates"),
  createQuestion("8", "person", "Add contacts", {
    answer: {
      comment: "",
      value: [
        createPerson("Mr", "Johnny", "Smith", "e@mail.com", "444-555-6666"),
        createPerson("Ms", "Pat", "Smith", "p@mail.com", "444-555-6666"),
      ],
    },
  }),
];
