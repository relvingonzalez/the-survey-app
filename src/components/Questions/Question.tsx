"use client";

import {
  ProcessByType,
  Question,
  QuestionByType,
  ValueByQuestionType,
} from "@/lib/types/question";
import QuestionComment from "../Comment";
import QuestionType from "./QuestionType";
import { useState, ChangeEventHandler } from "react";
import Files from "../files/Files.";
import { useListState } from "@mantine/hooks";

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
  const [files, handlers] = useListState<File>([]);
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
  const handleAnswered: OnAnsweredCallback<ValueByQuestionType<T>> = (
    value,
  ) => {
    setQuestion((prevState) => {
      const newQuestion = Object.assign({}, prevState);
      newQuestion.answer.value = value;
      return newQuestion;
    });
  };
  const handleFileDelete = (i: number) => {
    handlers.remove(i);
  };
  const handleSelectedFiles = (newFiles: File[]) => {
    handlers.append(...newFiles);
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
      <Files
        mt="10"
        files={files}
        onDeleteFile={handleFileDelete}
        onSelectFiles={handleSelectedFiles}
      />
    </>
  );
}
