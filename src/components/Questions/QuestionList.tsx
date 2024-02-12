"use client";

import { db } from "@/lib/dexie/db";
import { DexieQuestion, DexieResponse } from "@/lib/types/dexie";
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

type ItemListProps = {
  isQuestion?: boolean;
  items: DexieQuestion[];
  responses: DexieResponse[];
};

function ItemList({ items, isQuestion, responses }: ItemListProps) {
  const rows = items.map((item, index) => {
    const response = responses.find((r) => r.questionId === item.id);
    return (
      <TableTr key={`${item.id}-${index}`}>
        <TableTd>{item.order}</TableTd>
        <TableTd>{item.subheading}</TableTd>
        <TableTd>
          <Text size="sm" fs="italic">
            {" "}
            {item.question}
          </Text>
          <Text size="sm" fw="700">
            {response?.toString()}
          </Text>
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

export type QuestionListProps = {
  siteCode: SiteCode;
};

export function QuestionList({ siteCode }: QuestionListProps) {
  const site = useLiveQuery(() => db.siteProjects.get({ siteCode: siteCode }));
  const projectId = site ? site.projectId : 0;
  const questions = useLiveQuery(
    () =>
      db.questions
        .where({ projectId: projectId, questionType: "question" })
        .sortBy("order"),
    [projectId],
  );
  const questionResponses = useLiveQuery(
    () => db.responses.where({ projectId: projectId }).toArray(),
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
    () =>
      db.questions
        .where({ projectId: projectId, questionType: "process" })
        .sortBy("order"),
    [projectId],
  );
  const processResponses = useLiveQuery(
    () => db.responses.where({ projectId: projectId }).toArray(),
    [projectId],
  );

  if (!processes || !processResponses) {
    return null;
  }

  return <ItemList items={processes} responses={processResponses} />;
}
