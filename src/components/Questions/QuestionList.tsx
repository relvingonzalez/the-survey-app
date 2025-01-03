"use client";

import { db } from "@/lib/dexie/db";
import { SiteCode } from "@/lib/types/sites";
import {
  Button,
  Table,
  TableTr,
  TableTd,
  TableTh,
  TableThead,
  TableTbody,
  TableTfoot,
  Text,
} from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";
import { Entries } from "./QuestionTypes/QuestionCollection";
import { Question, Response } from "../../../internal";

type ItemListProps = {
  isQuestion?: boolean;
  items: Question[];
  responses: Response[];
};

function ItemList({ items, isQuestion, responses }: ItemListProps) {
  const rows = items.map((item, index) => {
    const response = responses.filter((r) => r.questionId === item.id);
    return (
      <TableTr key={`${item.id}-${index}`}>
        <TableTd>{item.order}</TableTd>
        <TableTd>{item.subheading}</TableTd>
        <TableTd>
          <Text size="sm" fs="italic">
            {" "}
            {item.question}
          </Text>
          {item.responseType === "collection" ? (
            <DisplayCollectionValues question={item} />
          ) : (
            <Text size="sm" fw="700">
              {Response.getDisplayValues(response)}
            </Text>
          )}
        </TableTd>
        <TableTd>
          <Button
            component={Link}
            href={`${isQuestion ? "questions" : "processes"}/${item.order}`}
            variant={response ? "light" : "default"}
          >
            <IconSettings />
          </Button>
        </TableTd>
      </TableTr>
    );
  });

  const ths = (
    <TableTr>
      <TableTh>ID</TableTh>
      <TableTh>Section</TableTh>
      <TableTh>Question/Answer</TableTh>
      <TableTh>Action</TableTh>
    </TableTr>
  );

  return (
    <Table captionSide="bottom" withColumnBorders>
      <TableThead bg="var(--mantine-color-gray-light)">{ths}</TableThead>
      <TableTbody>{rows}</TableTbody>
      <TableTfoot bg="var(--mantine-color-gray-light)">{ths}</TableTfoot>
    </Table>
  );
}

type DisplayCollectionValuesProps = {
  question: Question;
};

function DisplayCollectionValues({ question }: DisplayCollectionValuesProps) {
  const questions = useLiveQuery(
    () => question.getCollectionQuestions(),
    [question],
  );

  const responseGroups = useLiveQuery(
    () => Response.getCollectionResponses(questions),
    [questions],
  );

  if (!questions || !responseGroups) {
    return null;
  }

  return <Entries questions={questions} responseGroups={responseGroups} />;
}

export type QuestionListProps = {
  siteCode: SiteCode;
};

export function QuestionList({ siteCode }: QuestionListProps) {
  const site = useLiveQuery(() => db.siteProjects.get({ siteCode: siteCode }));
  const projectId = site ? site.projectId : 0;
  const questions = useLiveQuery(
    () => Question.getMainQuestions(projectId, "question"),
    [projectId],
  );
  const questionResponses = useLiveQuery(
    () => Response.getAllByProject(projectId),
    [projectId],
  );

  if (!questions || !questionResponses) {
    return null;
  }

  return (
    <ItemList isQuestion items={questions} responses={questionResponses} />
  );
}

export function ProcessList({ siteCode }: QuestionListProps) {
  const site = useLiveQuery(() => db.siteProjects.get({ siteCode: siteCode }));
  const projectId = site ? site.projectId : 0;
  const processes = useLiveQuery(
    () => Question.getMainQuestions(projectId, "process"),
    [projectId],
  );
  const processResponses = useLiveQuery(
    () => Response.getAllByProject(projectId),
    [projectId],
  );

  if (!processes || !processResponses) {
    return null;
  }

  return <ItemList items={processes} responses={processResponses} />;
}
