"use client";

import QuestionComment from "../Comment";
import QuestionByTypeComponent from "./QuestionByTypeComponent";
import { ChangeEventHandler } from "react";
import Files from "../files/Files.";
import { useListState } from "@mantine/hooks";
import { SiteCode } from "@/lib/types/sites";
import { db } from "@/lib/dexie/db";
import { useLiveQuery } from "dexie-react-hooks";
import { DexieQuestion, DexieResponse } from "@/lib/types/dexie";
import { QuestionType } from "@/lib/types/question_new";
import {
  getComment,
  getResponse,
  insertOrModifyResponses,
  updateComment,
} from "@/lib/dexie/helper";

export type BaseQuestionProps = {
  item: DexieQuestion;
};

type OnAnsweredCallback<V> = (value: V) => void;

export type WithQuestionCallback<V> = {
  onAnswered: OnAnsweredCallback<V>;
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
      return updateComment(value, comment?.localId);
    }
  };
  const handleAnswered: OnAnsweredCallback<DexieResponse | DexieResponse[]> = (
    value,
  ) => {
    const responses = value instanceof Array ? value : [value];
    return db.transaction("rw", db.responses, () => {
      // Add response id before saving locally
      return insertOrModifyResponses(
        responses.map((r) => ({
          ...r,
          questionResponseId: r.questionResponseId || comment?.id,
        })),
      );
    });
  };
  const handleFileDelete = (i: number) => {
    handlers.remove(i);
  };
  const handleSelectedFiles = (newFiles: File[]) => {
    handlers.append(...newFiles);
  };

  if (!question || !comment || !response) {
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
