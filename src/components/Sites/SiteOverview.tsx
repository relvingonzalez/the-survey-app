"use client";

import { brandTitle } from "@/lib/constants/constants";
import { useLiveQuery } from "dexie-react-hooks";
import { Card, CardSection, Group, Text, Button } from "@mantine/core";
import {
  IconInfoCircleFilled,
  IconAddressBook,
  IconSignature,
  IconSettingsCog,
  IconEdit,
  IconHelpSquare,
} from "@tabler/icons-react";
import Link from "next/link";
import { db } from "@/lib/dexie/db";
import { getNextUnansweredQuestion } from "@/lib/dexie/helper";
import { useQuestionsWithCounts } from "@/lib/hooks/useQuestionsWithCounts";

type SiteOverviewProps = {
  siteCode: string;
};

export default function SiteOverview({ siteCode }: SiteOverviewProps) {
  const site = useLiveQuery(() => db.siteProjects.get({ siteCode: siteCode }));
  const {
    questions,
    processes,
    allResponses,
    roomsCount,
    questionsCount,
    processesCount,
    questionResponsesCount,
    processResponsesCount,
  } = useQuestionsWithCounts(site);
  const nextQuestion = getNextUnansweredQuestion(questions, allResponses);
  const nextProcess = getNextUnansweredQuestion(processes, allResponses);

  if (!site) {
    return null;
  }

  return (
    <>
      <Card withBorder shadow="sm" radius="md">
        <CardSection
          data-first-section="true"
          withBorder
          inheritPadding
          py="xs"
        >
          <Group justify="start">
            <IconAddressBook />
            <Text size="xl" fw={500}>
              Site Overview
            </Text>
          </Group>
        </CardSection>
        <Text mt="10" inherit>
          {site.name}
        </Text>
        <Text inherit>{site.street}</Text>
        <Text>
          {site.city}, {site.state}
        </Text>
        <Button mt="4" w="fit-content" leftSection={<IconInfoCircleFilled />}>
          Details
        </Button>
      </Card>

      <Card withBorder mt="10" shadow="sm" radius="md">
        <CardSection
          inheritPadding
          data-first-section="true"
          withBorder
          py="xs"
        >
          <Group justify="startr">
            <IconHelpSquare />
            <Text size="xl" fw={500}>
              Questions
            </Text>
          </Group>
        </CardSection>

        <Text mt="10">
          Total: {questionsCount}, Answered: {questionResponsesCount}
        </Text>
        <Group justify="space-between">
          <Button
            component={Link}
            href={`${site.siteCode}/questions`}
            mt="8"
            w="fit-content"
            variant="warning"
          >
            List
          </Button>
          <Button
            component={Link}
            href={`${site.siteCode}/questions/${nextQuestion?.order}`}
            mt="8"
            w="fit-content"
          >
            Go
          </Button>
        </Group>
      </Card>

      <Card withBorder mt="10" shadow="sm" radius="md">
        <CardSection
          inheritPadding
          data-first-section="true"
          withBorder
          py="xs"
        >
          <Group justify="start">
            <IconEdit />
            <Text size="xl" fw={500}>
              Rooms/Layouts
            </Text>
          </Group>
        </CardSection>
        <Text mt="10">Drawings: {roomsCount}</Text>
        <Group justify="space-between">
          <Button
            component={Link}
            href={`${site.siteCode}/rooms`}
            mt="8"
            w="fit-content"
            variant="warning"
          >
            List
          </Button>
          <Button
            mt="8"
            w="fit-content"
            component={Link}
            href={`${site.siteCode}/rooms/new`}
          >
            New
          </Button>
        </Group>
      </Card>

      <Card withBorder mt="10" shadow="sm" radius="md">
        <CardSection
          data-first-section="true"
          withBorder
          inheritPadding
          py="xs"
        >
          <Group justify="start">
            <IconSettingsCog />
            <Text size="xl" fw={500}>
              Processes
            </Text>
          </Group>
        </CardSection>
        <Text mt="10">
          Total: {processesCount}, Answered: {processResponsesCount}
        </Text>
        <Group justify="space-between">
          <Button
            component={Link}
            href={`${site.siteCode}/processes`}
            mt="8"
            w="fit-content"
            variant="warning"
          >
            List
          </Button>
          <Button
            component={Link}
            href={`${site.siteCode}/processes/${nextProcess?.order}`}
            mt="8"
            w="fit-content"
          >
            Go
          </Button>
        </Group>
      </Card>

      <Card withBorder mt="10" shadow="sm" radius="md">
        <CardSection
          data-first-section="true"
          withBorder
          inheritPadding
          py="xs"
        >
          <Group justify="start">
            <IconSignature />
            <Text size="xl" fw={500}>
              {brandTitle} Sign-Off
            </Text>
          </Group>
        </CardSection>
        <Group justify="right">
          <Button
            variant="warning"
            component={Link}
            href={`${site.siteCode}/signatures`}
            mt="8"
            w="fit-content"
          >
            Sign-Off
          </Button>
        </Group>
      </Card>
    </>
  );
}
