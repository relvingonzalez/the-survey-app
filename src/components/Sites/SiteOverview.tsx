'use client'

import { Site } from '@/lib/types/sites';
import { Card, Group, Text, Button } from '@mantine/core';
import { IconInfoCircleFilled, IconAddressBook } from '@tabler/icons-react';
import Link from 'next/link';

type SiteOverviewProps = {
  site: Site;
}

export default function SiteOverview({site}: SiteOverviewProps) {
  return (
    <>
    <Card withBorder shadow="sm" radius="md">
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="start">
          <IconAddressBook />
          <Text size="xl" fw={500}>Site Overview</Text>
        </Group>
      </Card.Section>
      <Text mt="10" inherit>
        {site.location}
      </Text>
     <Button mt="4" w="fit-content" leftSection={<IconInfoCircleFilled />} >Details</Button>
    </Card>

    <Card withBorder mt="10" shadow="sm" radius="md">
      <Card.Section inheritPadding py="xs">
        <Group justify="start">
          <Text size="xl" fw={500}>Questions</Text>
        </Group>
      </Card.Section>

      <Text mt="10">Total: 32, Answered: 3</Text>
      <Group justify="space-between">
        <Link href={`${site.siteCode}/list`}><Button mt="8" w="fit-content" variant="warning">List</Button></Link>
        <Button mt="8" w="fit-content">Go</Button>
      </Group>
    </Card>

    <Card withBorder mt="10" shadow="sm" radius="md">
      <Card.Section inheritPadding py="xs">
        <Group justify="start">
          <Text size="xl" fw={500}>Rooms/Layouts</Text>
        </Group>
      </Card.Section>
      <Text mt="10">Drawings: 2</Text>
      <Group justify="space-between">
      <Link href={`${site.siteCode}/rooms`}><Button mt="8" w="fit-content" variant="warning">List</Button></Link>
        <Button mt="8" w="fit-content">New</Button>
      </Group>
    </Card>

    <Card withBorder mt="10" shadow="sm" radius="md">
      <Card.Section inheritPadding py="xs">
        <Group justify="start">
          <Text size="xl" fw={500}>Processes</Text>
        </Group>
      </Card.Section>
      <Text mt="10">Total: 32, Answered: 3</Text>
      <Group justify="space-between">
      <Link href={`${site.siteCode}/processes`}><Button mt="8" w="fit-content" variant="warning">List</Button></Link>
        <Button mt="8" w="fit-content">Go</Button>
      </Group>
    </Card>
    </>

  );
}