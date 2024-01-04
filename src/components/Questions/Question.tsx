"use client";

import { ProcessByType, Question, QuestionByType } from "@/lib/types/question";
import QuestionComment from "./QuestionComment";
import QuestionType from "./QuestionType";
import { useState, ChangeEventHandler } from "react";

export type BaseQuestionProps<T> = {
  question: QuestionByType<T> | ProcessByType<T>;
};

type QuestionProps<T> = BaseQuestionProps<T> & {
  hideFileButtons?: boolean;
};

type OnAnsweredCallback<V> = (value: V) => void;

export type WithQuestionCallback<V> = {
  onAnswered: OnAnsweredCallback<V>;
};

export default function Question<T extends Question>({
  question,
}: QuestionProps<T>) {
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
  const handleAnswered: OnAnsweredCallback<T["answer"]["value"]> = (value) => {
    setQuestion((prevState) => {
      const newQuestion = Object.assign({}, prevState);
      newQuestion.answer.value = value;
      return newQuestion;
    });
  };
  const showComment = true;
  question.hasComment ||
    (question.type === "multiple" &&
      question.answer.value.some((v) => ["Other", "Others"].includes(v)));

  return (
    <>
      <QuestionType question={question} onAnswered={handleAnswered} />
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
