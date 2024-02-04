"use client";

import { Card, CardSection, Group, Stack, Text, Title } from "@mantine/core";
import { PropsWithChildren } from "react";
import QuestionNavigation from "./QuestionNavigation";
import { SiteCode } from "@/lib/types/sites";
import { db } from "@/lib/dexie/db";
import { useLiveQuery } from "dexie-react-hooks";

type QuestionLayoutProps = PropsWithChildren & {
  siteCode: SiteCode;
  order: number;
  isQuestion?: boolean;
};

export default function QuestionLayout({
  children,
  isQuestion,
  siteCode,
  order,
}: QuestionLayoutProps) {
  const title = isQuestion ? "Questions" : "Processes";
  const site = useLiveQuery(() => db.siteProjects.get({ siteCode }));
  const projectId = site ? site.projectId : 0;
  const table = isQuestion ? db.questions : db.processes;
  const question = useLiveQuery(
    () => table.get({ projectId, order }),
    [projectId, order],
  );
  const questionsCount = useLiveQuery(
    () => table.where({ projectId }).count(),
    [table, projectId],
  );
  const prev = question && question.order > 0 ? question.order - 1 : undefined;
  const next =
    question && questionsCount && question.order < questionsCount
      ? question.order + 1
      : undefined;

  if (!question) {
    return null;
  }

  return (
    <Stack mb="80">
      <Title order={2}>
        {title}: {question.subheading}
      </Title>
      <Card withBorder shadow="sm" radius="md">
        <CardSection inheritPadding py="xs">
          <Group justify="start">
            <Text size="xl" fw={500}>
              {question.order}.{question.question}
            </Text>
          </Group>
        </CardSection>
        {children}
      </Card>
      <QuestionNavigation prev={prev} next={next} />
    </Stack>
  );
}
