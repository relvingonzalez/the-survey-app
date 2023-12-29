"use client";

import { Process, Question } from "@/lib/types/question";
import QuestionComment from "./QuestionComment";
import QuestionType from "./QuestionType";

export type BaseQuestionProps = {
  question: Question | Process;
};

type QuestionProps = BaseQuestionProps & {
  hideFileButtons?: boolean;
};

export default function Question({ question }: QuestionProps) {
  const showComment =
    question.hasComment ||
    (question.type === "MULTIPLE" &&
      ["Other", "Others"].includes(question.answer.value));

  return (
    <>
      <QuestionType question={question} />
      {showComment && (
        <QuestionComment
          mt="10"
          value={question.answer.comment}
          onChange={() => console.log("changed")}
        />
      )}
      filebuttonsHere
    </>
  );
}
