"use client";

import { Process, Question } from "@/lib/types/question";
import QuestionComment from "./QuestionComment";
import QuestionType from "./QuestionType";
import { useState, ChangeEventHandler } from "react";

export type BaseQuestionProps = {
  question: Question | Process;
};

type QuestionProps = BaseQuestionProps & {
  hideFileButtons?: boolean;
};

export default function Question({ question }: QuestionProps) {
  const [currentQuestion, setQuestion] = useState(question);
  const handleCommentChange: ChangeEventHandler<HTMLTextAreaElement> &
    ((value: string) => void) = (value) => {
    if (typeof value === "string") {
      setQuestion((prevState) => {
        const newQuestion = Object.assign({}, prevState);
        newQuestion.answer.comment = value;
        return newQuestion;
      });
    }
  };
  const handleAnswerChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuestion((prevState) => {
      const newQuestion = Object.assign({}, prevState);
      newQuestion.answer.value = e.target.value;
      return newQuestion;
    });
  };
  const showComment =
    question.hasComment ||
    (question.type === "multiple" &&
      question.answer.value.some((v) => ["Other", "Others"].includes(v)));

  return (
    <>
      <QuestionType question={question} onChange={handleAnswerChange} />
      {showComment && (
        <QuestionComment
          mt="10"
          value={currentQuestion.answer.comment}
          onChange={handleCommentChange}
        />
      )}
      filebuttonsHere
    </>
  );
}
