"use client";

import { Process, Question } from "@/lib/types/question";
import { Site } from "@/lib/types/sites";
import { Button, Card, Group, Text, Title } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconList,
} from "@tabler/icons-react";
import Link from "next/link";
import { PropsWithChildren } from "react";

type QuestionLayoutProps = PropsWithChildren & {
  site: Site;
  question: Question | Process;
  isQuestion?: boolean;
};

export default function QuestionLayout({
  question,
  site,
  children,
  isQuestion,
}: QuestionLayoutProps) {
  return (
    <>
      <Title order={2}>
        {isQuestion ? "Questions" : "Processes"}: {question.sub1}
      </Title>
      <Card withBorder shadow="sm" radius="md">
        <Card.Section inheritPadding py="xs">
          <Group justify="start">
            <Text size="xl" fw={500}>
              {question.id}.{question.question}
            </Text>
          </Group>
        </Card.Section>
        {children}
      </Card>
      <Group justify="space-between">
        <Link href={`${site.siteCode}/processes`}>
          <Button mt="8" w="fit-content" leftSection={<IconChevronLeft />}>
            Prev
          </Button>
        </Link>
        <Link href="./">
          <Button
            mt="8"
            leftSection={<IconList />}
            w="fit-content"
            variant="warning"
          >
            List
          </Button>
        </Link>
        <Link href={`${site.siteCode}/processes`}>
          <Button mt="8" w="fit-content" leftSection={<IconChevronRight />}>
            Next
          </Button>
        </Link>
      </Group>
    </>
  );
}
