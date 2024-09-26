"use client";

import QuestionComment from "../Comment";
import QuestionByTypeComponent from "./QuestionByTypeComponent";
import { ChangeEventHandler } from "react";
import Files from "../files/Files.";
import { SiteCode } from "@/lib/types/sites";
import { db } from "@/lib/dexie/db";
import { useLiveQuery } from "dexie-react-hooks";
import { QuestionType } from "@/lib/types/question";
import { Comment, Question, Response, SurveyFile } from "../../../internal";

export type BaseQuestionProps = {
  item: Question;
};

export type QuestionCallback = (
  response?: Response | (Response | undefined)[],
) => void;

export type WithQuestionCallback = {
  onAnswered: QuestionCallback;
};

export type WithQuestionCallbacks = {
  onAnswered: QuestionCallback;
  onDeleted: QuestionCallback;
};

export type QuestionProps = {
  type: QuestionType;
  siteCode: SiteCode;
  order: number;
};

export default function QuestionComponent({
  siteCode,
  order,
  type,
}: QuestionProps) {
  const site = useLiveQuery(() => db.siteProjects.get({ siteCode }));
  const projectId = site ? site.projectId : 0;
  const question = useLiveQuery(
    () => db.questions.get({ projectId, order, questionType: type }),
    [projectId, order, type],
  );
  const response = useLiveQuery(
    () => question && Response.getFromQuestion(question),
    [question],
  );
  const comment = useLiveQuery(
    () => question && Comment.getFromQuestion(question),
    [question],
  );
  const files = useLiveQuery(
    () => comment && SurveyFile.getByResponse(comment),
    [question, comment],
  );
  const handleCommentChange: ChangeEventHandler<HTMLTextAreaElement> &
    ((value: string) => void) = (value) => {
    if (typeof value === "string") {
      comment?.update({ comment: value });
    }
  };
  const handleAnswered: QuestionCallback = (value) => {
    if (!comment || !value) {
      return;
    }
    const responses = value instanceof Array ? value : [value];
    responses.forEach((r) => {
      if (r) {
        r.questionResponseId = r.questionResponseId || comment?.id;
        r.localId ? r.save() : Response.add(r);
      }
    });
  };
  const handleDeleted: QuestionCallback = (value) => {
    const responses = value instanceof Array ? value : [value];
    responses.forEach((r) => {
      r && r.delete();
    });
  };
  const handleFileDelete = (i: number) => {
    if (files) {
      files[i].delete();
    }
  };
  const handleSelectedFiles = (newFiles: File[]) => {
    if (response) {
      newFiles.forEach((f) => {
        SurveyFile.add({
          questionResponseId: response[0].questionResponseId,
          file: f,
        });
      });
    }
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
        onDeleted={handleDeleted}
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
