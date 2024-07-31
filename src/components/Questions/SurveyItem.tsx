"use client";

import QuestionComment from "../Comment";
import QuestionByTypeComponent from "./QuestionByTypeComponent";
import { ChangeEventHandler } from "react";
import Files from "../files/Files.";
import { useListState } from "@mantine/hooks";
import { SiteCode } from "@/lib/types/sites";
import { db } from "@/lib/dexie/db";
import { useLiveQuery } from "dexie-react-hooks";
import { DexieQuestion } from "@/lib/types/dexie";
import { QuestionType } from "@/lib/types/question";
import { getComment, getResponse } from "@/lib/dexie/helper";
import Response from "@/lib/dexie/Response";

export type BaseQuestionProps = {
  item: DexieQuestion;
};

type OnAnsweredCallback = (response?: Response | (Response | undefined)[]) => void;

export type WithQuestionCallback = {
  onAnswered: OnAnsweredCallback;
};

export type QuestionProps = {
  type: QuestionType;
  siteCode: SiteCode;
  order: number;
};

export default function Question({ siteCode, order, type }: QuestionProps) {
  const site = useLiveQuery(() => db.siteProjects.get({ siteCode }));
  const projectId = site ? site.projectId : 0;
  const question = useLiveQuery(
    () => db.questions.get({ projectId, order, questionType: type }),
    [projectId, order, type],
  );
  const response = useLiveQuery(
     () => getResponse(projectId, question),
    [projectId, question],
  );
  const comment = useLiveQuery(
    () => getComment(projectId, question),
    [projectId, question],
  );
  const [files, handlers] = useListState<File>([]);
  const handleCommentChange: ChangeEventHandler<HTMLTextAreaElement> &
    ((value: string) => void) = (value) => {
    if (typeof value === "string") {
      comment?.update({ comment: value });
    }
  };
  const handleAnswered: OnAnsweredCallback = (value) => {
    if (!comment || !value) {
      return;
    }
    const responses = value instanceof Array ? value : [value];
    responses.forEach((r) => {
      if(r) {
        r.questionResponseId = r.questionResponseId || comment?.id;
        r.flag === "d" ? r.delete() : r.save();
      }
    });
  };
  const handleFileDelete = (i: number) => {
    handlers.remove(i);
  };
  const handleSelectedFiles = (newFiles: File[]) => {
    handlers.append(...newFiles);
  };

  if (!question || !comment || !response?.length) {
    return null;
  }

  return (
    <>
      <QuestionByTypeComponent
        question={question}
        response={response}
        onAnswered={handleAnswered}
      />
      <QuestionComment
        mt="10"
        value={comment.comment}
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
