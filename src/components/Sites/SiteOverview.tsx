import { Site } from "@/lib/types/sites";
import { Card, CardSection, Group, Text, Button } from "@mantine/core";
import { IconInfoCircleFilled, IconAddressBook } from "@tabler/icons-react";
import Link from "next/link";

type SiteOverviewProps = {
  site: Site;
};

export default function SiteOverview({ site }: SiteOverviewProps) {
  return (
    <>
      <Card withBorder shadow="sm" radius="md">
        <CardSection withBorder inheritPadding py="xs">
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
        <CardSection inheritPadding py="xs">
          <Group justify="start">
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
          <Button mt="8" w="fit-content">
            Go
          </Button>
        </Group>
      </Card>

      <Card withBorder mt="10" shadow="sm" radius="md">
        <CardSection inheritPadding py="xs">
          <Group justify="start">
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
          <Button mt="8" w="fit-content">
            New
          </Button>
        </Group>
      </Card>

      <Card withBorder mt="10" shadow="sm" radius="md">
        <CardSection inheritPadding py="xs">
          <Group justify="start">
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
          <Button mt="8" w="fit-content">
            Go
          </Button>
        </Group>
      </Card>
    </>
  );
}
