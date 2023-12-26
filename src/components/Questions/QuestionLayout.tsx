import { Process, Question } from "@/lib/types/question";
import { Site } from "@/lib/types/sites";
import { Button, Card, CardSection, Group, Text, Title } from "@mantine/core";
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
        <CardSection inheritPadding py="xs">
          <Group justify="start">
            <Text size="xl" fw={500}>
              {question.id}.{question.question}
            </Text>
          </Group>
        </CardSection>
        {children}
      </Card>
      <Group justify="space-between">
        <Button
          component={Link}
          href={`${site.siteCode}/processes`}
          mt="8"
          w="fit-content"
          leftSection={<IconChevronLeft />}
        >
          Prev
        </Button>
        <Button
          component={Link}
          href="./"
          mt="8"
          leftSection={<IconList />}
          w="fit-content"
          variant="warning"
        >
          List
        </Button>
        <Button
          component={Link}
          href={`${site.siteCode}/processes`}
          mt="8"
          w="fit-content"
          leftSection={<IconChevronRight />}
        >
          Next
        </Button>
      </Group>
    </>
  );
}
