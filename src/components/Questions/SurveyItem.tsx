"use client";

import {
  Question,
  QuestionType,
  ValueByQuestionType,
} from "@/lib/types/question";
import QuestionComment from "../Comment";
import QuestionByTypeComponent from "./QuestionByTypeComponent";
import { useState, ChangeEventHandler } from "react";
import Files from "../files/Files.";
import { useListState } from "@mantine/hooks";
import { SiteCode } from "@/lib/types/sites";
import { db } from "@/lib/dexie/db";
import { useLiveQuery } from "dexie-react-hooks";
import {
  DexieProcess,
  DexieProcessResponse,
  DexieQuestion,
  DexieQuestionResponse,
  DexieRackQuestion,
  DexieRackQuestionResponse,
} from "@/lib/types/dexie";
import { createQuestion } from "@/lib/data/questions";

export type BaseQuestionProps = {
  item: DexieQuestion | DexieProcess | DexieRackQuestion;
  itemResponse:
    | DexieQuestionResponse
    | DexieProcessResponse
    | DexieRackQuestionResponse;
};

type SurveyItemProps = BaseQuestionProps & {
  hideFileButtons?: boolean;
};

type OnAnsweredCallback<V> = (value: V) => void;

const stringTypes: QuestionType[] = [
  "yes/no",
  "text",
  "phone",
  "email",
  "number",
  "geo",
];

export type WithQuestionCallback<V> = {
  onAnswered: OnAnsweredCallback<V>;
};

export default function SurveyItem<T extends Question>({
  item,
  itemResponse,
}: SurveyItemProps) {
  const [currentQuestion, setQuestion] = useState<T>(
    createQuestion(item.id, item.type, item.question, {
      listOptions: item.options,
      answer: {
        value: stringTypes.includes(item.type)
          ? itemResponse.response
          : itemResponse.response && JSON.parse(itemResponse.response),
        comment: itemResponse.comment,
      },
    }) as T,
  );
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

  return (
    <>
      <QuestionByTypeComponent
        question={currentQuestion}
        onAnswered={handleAnswered}
      />
      <QuestionComment
        mt="10"
        value={currentQuestion.answer.comment}
        onChange={handleCommentChange}
      />
      <Files
        mt="10"
        files={files}
        onDeleteFile={handleFileDelete}
        onSelectFiles={handleSelectedFiles}
      />
    </>
  );
}

export type QuestionProps = {
  siteCode: SiteCode;
  order: number;
};

export function Question({ siteCode, order }: QuestionProps) {
  const site = useLiveQuery(() => db.siteProjects.get({ siteCode }));
  const projectId = site ? site.projectId : 0;
  const question = useLiveQuery(
    () => db.questions.get({ projectId, order }),
    [projectId, order],
  );
  const response = useLiveQuery(async () => {
    const tempResponse = await (question &&
      db.questionResponses.get({ questionId: question.id }));
    return (
      tempResponse ||
      (question && {
        id: undefined,
        projectId,
        questionId: question.id,
        response: "",
        comment: "",
      })
    );
  }, [question]);

  if (!question || !response) {
    return null;
  }

  return <SurveyItem item={question} itemResponse={response} />;
}

export function Process({ siteCode, order }: QuestionProps) {
  const site = useLiveQuery(() => db.siteProjects.get({ siteCode }));
  const projectId = site ? site.projectId : 0;
  const process = useLiveQuery(
    () => db.processes.get({ projectId, order }),
    [projectId, order],
  );
  const response = useLiveQuery(async () => {
    const tempResponse = await (process &&
      db.processResponses.get({ processId: process.id }));
    return (
      tempResponse ||
      (process && {
        id: undefined,
        projectId,
        questionId: process.id,
        response: "",
        comment: "",
      })
    );
  }, [process]);

  if (!process || !response) {
    return null;
  }

  return <SurveyItem item={process} itemResponse={response} />;
}
