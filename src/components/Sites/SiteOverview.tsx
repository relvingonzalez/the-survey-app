'use client'

import { Card, Group, Text, Anchor } from '@mantine/core';
import { IconClockHour9 } from '@tabler/icons-react';
import Link from 'next/link';

export default function SiteOverview() {
  return (
    <>
    <Card withBorder shadow="sm" radius="md">
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="start">
          <IconClockHour9 />
          <Text size="xl" fw={500}>Site Overview</Text>
        </Group>
      </Card.Section>
      <Text mt="10" inherit>
        You are logged in as <Text span fw={700}>rs@orga.zone</Text>.
      </Text>
      <Text mt="10">Your last login was: 3rd of May, 2017.</Text>
      <Text my="10">Last server contact: 2nd of May, 2017.</Text>
      <Anchor component={Link} href="local">
        <Text span fw={700}>4</Text> local sites available
      </Anchor>
    </Card>

    <Card withBorder mt="10" shadow="sm" radius="md">
      <Card.Section inheritPadding py="xs">
        <Group justify="start">
          <Text size="xl" fw={500}>Questions</Text>
        </Group>
      </Card.Section>
      <Text mt="10">Total: 32, Answered: 3</Text>
    </Card>

    <Card withBorder mt="10" shadow="sm" radius="md">
      <Card.Section inheritPadding py="xs">
        <Group justify="start">
          <Text size="xl" fw={500}>Rooms/Layouts</Text>
        </Group>
      </Card.Section>
      <Text mt="10">Drawings: 2</Text>
    </Card>

    <Card withBorder mt="10" shadow="sm" radius="md">
      <Card.Section inheritPadding py="xs">
        <Group justify="start">
          <Text size="xl" fw={500}>Processes</Text>
        </Group>
      </Card.Section>
      <Text mt="10">Total: 32, Answered: 3</Text>
    </Card>
    </>

  );
}