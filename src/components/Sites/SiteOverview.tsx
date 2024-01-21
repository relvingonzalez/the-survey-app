import { brandTitle } from "@/lib/constants/constants";
import { Processes, Questions } from "@/lib/types/question";
import { Site } from "@/lib/types/sites";
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

type SiteOverviewProps = {
  site: Site;
  questions: Questions;
  processes: Processes;
};

export default function SiteOverview({
  site,
  questions,
  processes,
}: SiteOverviewProps) {
  const nextQuestion =
    questions.find((q) => !q.answer.value)?.id || questions[0].id;
  const nextProcess =
    processes.find((p) => !p.answer.value)?.id || processes[0].id;

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
          {site.location}
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

        <Text mt="10">Total: 32, Answered: 3</Text>
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
            href={`${site.siteCode}/questions/${nextQuestion}`}
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
        <Text mt="10">Drawings: 2</Text>
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
        <Text mt="10">Total: 32, Answered: 3</Text>
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
            href={`${site.siteCode}/processes/${nextProcess}`}
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
