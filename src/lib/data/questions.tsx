import { Question, Questions, TextQuestion } from "../types/question";
import { createPerson } from "../utils/functions";

export const dummyQuestion: TextQuestion = {
  id: 1,
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
  id: 2,
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

export function createQuestion<QuestionType>(
  id: number,
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
  createQuestion(3, "email", "Type your Email"),
  createQuestion(4, "list", "What is your favorite vacation spot?", {
    listOptions: ["Brazil", "Norway", "USA", "Denmark"],
  }),
  createQuestion(5, "checkbox", "Where have you looked?", {
    listOptions: ["under the bed", "Behind the counters", "under the sink"],
    answer: { comment: "", value: {} },
  }),
  createQuestion(6, "multiple", "What countries have you visited?", {
    listOptions: ["Brazil", "Norway", "USA", "Denmark"],
    answer: {
      comment: "",
      value: [],
    },
  }),
  createQuestion(7, "geo", "Get your coordinates"),
  createQuestion(8, "person", "Add contacts", {
    answer: {
      comment: "",
      value: [
        createPerson(0, "Johnny", "Smith", "e@mail.com", "444-555-6666"),
        createPerson(1, "Pat", "Smith", "p@mail.com", "444-555-6666"),
      ],
    },
  }),
  createQuestion(9, "time", "When is this site open", {
    answer: {
      comment: "",
      value: {
        fromTime: "",
        toTime: "",
      },
    },
  }),
  createQuestion(10, "days", "What days is it open", {
    answer: {
      comment: "",
      value: [0, 1],
    },
  }),
  createQuestion(11, "datetime", "When is this site open", {
    answer: {
      comment: "",
      value: new Date(),
    },
  }),
  createQuestion(12, "collection", "What Collection?", {
    entries: [
      createQuestion(3, "email", "Type your Email"),
      createQuestion(4, "list", "What is your favorite vacation spot?", {
        listOptions: ["Brazil", "Norway", "USA", "Denmark"],
      }),
    ],
    answer: {
      comment: "",
      value: [
        [
          createQuestion(3, "email", "Type your Email", {
            answer: { comment: "", value: "mail23@mail.com" },
          }),
          createQuestion(4, "list", "What is your favorite vacation spot?", {
            listOptions: ["Brazil", "Norway", "USA", "Denmark"],
            answer: {
              comment: "Nada",
              value: "Brazil",
            },
          }),
        ],
        [
          createQuestion(3, "email", "Type your Email", {
            answer: { comment: "", value: "mail@mail.com" },
          }),
          createQuestion(4, "list", "What is your favorite vacation spot?", {
            listOptions: ["Brazil", "Norway", "USA", "Denmark"],
            answer: {
              comment: "Nada",
              value: "Norway",
            },
          }),
        ],
      ],
    },
  }),
  createQuestion(13, "yes/no", "Yes or no?", {
    answer: { value: false, comment: "" },
  }),
];
