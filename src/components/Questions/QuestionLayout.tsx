"use client";

import { Card, CardSection, Group, Stack, Text, Title } from "@mantine/core";
import { PropsWithChildren, useEffect } from "react";
import QuestionNavigation from "./QuestionNavigation";
import { SiteCode } from "@/lib/types/sites";
import { db } from "@/lib/dexie/db";
import { useLiveQuery } from "dexie-react-hooks";
import { usePathname, useSearchParams } from "next/navigation";
import { useQuestionNavigation } from "@/lib/hooks/useQuestionNavigation";

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
  const questionType = isQuestion ? "question" : "process";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const title = isQuestion ? "Questions" : "Processes";
  const site = useLiveQuery(() => db.siteProjects.get({ siteCode }));
  const projectId = site ? site.projectId : 0;
  const { current, prev, next } = useQuestionNavigation(
    projectId,
    order,
    questionType,
  );

  useEffect(() => {
    const exitingFunction = () => {
      console.log("exiting...", current?.question);
    };

    if (current && pathname && searchParams) {
      exitingFunction();
    }
  }, [current, pathname, searchParams]);

  if (!current) {
    return null;
  }

  return (
    <Stack mb="80">
      <Title order={2}>
        {title}: {current.subheading}
      </Title>
      <Card withBorder shadow="sm" radius="md">
        <CardSection inheritPadding py="xs">
          <Group justify="start">
            <Text size="xl" fw={500}>
              {current.order}.{current.question}
            </Text>
          </Group>
        </CardSection>
        {children}
      </Card>
      <QuestionNavigation prev={prev?.order} next={next?.order} />
    </Stack>
  );
}
