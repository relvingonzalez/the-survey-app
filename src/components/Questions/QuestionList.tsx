"use client";

import { db } from "@/lib/dexie/db";
import {
  DexieProcess,
  DexieProcessResponse,
  DexieQuestion,
  DexieQuestionResponse,
} from "@/lib/types/dexie";
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

type ItemListProps =
  | {
      isQuestion?: false;
      items: DexieProcess[];
      responses: DexieProcessResponse[];
    }
  | {
      isQuestion: true;
      items: DexieQuestion[];
      responses: DexieQuestionResponse[];
    };

function ItemList({ items, isQuestion, responses }: ItemListProps) {
  const rows = items.map((item, index) => {
    const response = isQuestion
      ? responses.find((r) => r.questionId === item.id)
      : responses.find((r) => r.processId === item.id);
    return (
      <TableTr key={`${item.id}-${index}`}>
        <TableTd>{item.id}</TableTd>
        <TableTd>{item.subheading}</TableTd>
        <TableTd>
          <Text size="sm" fs="italic">
            {" "}
            {item.question}
          </Text>
          <Text size="sm" fw="700">
            {response?.response?.toString()}
          </Text>
        </TableTd>
        <TableTd>
          <Button
            component={Link}
            href={`${isQuestion ? "questions" : "processes"}/${item.order}`}
            variant={response?.response ? "light" : "default"}
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
    () => db.questions.where({ projectId: projectId }).sortBy("order"),
    [projectId],
  );
  const questionResponses = useLiveQuery(
    () => db.questionResponses.where({ projectId: projectId }).toArray(),
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
    () => db.processes.where({ projectId: projectId }).sortBy("order"),
    [projectId],
  );
  const processResponses = useLiveQuery(
    () => db.processResponses.where({ projectId: projectId }).toArray(),
    [projectId],
  );

  if (!processes || !processResponses) {
    return null;
  }

  return <ItemList items={processes} responses={processResponses} />;
}
