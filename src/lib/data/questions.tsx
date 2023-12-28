import { Question, Questions } from "../types/question";

export const dummyQuestion: Question = {
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
  question: "How blue is the ocean?",
  sub1: "The most important question",
  answer: {
    value: "",
    comment: "",
  },
  displayValue: "Very Hot",
  type: "text",
  hasDrawing: false,
  hasFile: false,
  hasComment: false,
};

export const dummyQuestions: Questions = [dummyQuestion, dummyQuestion2];
