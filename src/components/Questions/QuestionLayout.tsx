import { Process, Question } from "@/lib/types/question";
import { UUID } from "@/lib/types/util";
import { Card, CardSection, Group, Stack, Text, Title } from "@mantine/core";
import { PropsWithChildren } from "react";
import QuestionNavigation from "./QuetionNavigation";

type QuestionLayoutProps = PropsWithChildren & {
  prevId?: UUID;
  nextId?: UUID;
  question: Question | Process;
  isQuestion?: boolean;
};

export default function QuestionLayout({
  children,
  nextId,
  isQuestion,
  prevId,
  question,
}: QuestionLayoutProps) {
  const title = isQuestion ? "Questions" : "Processes";

  return (
    <Stack mb="80">
      <Title order={2}>
        {title}: {question.sub1}
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
      <QuestionNavigation prevId={prevId} nextId={nextId} />
    </Stack>
  );
}
