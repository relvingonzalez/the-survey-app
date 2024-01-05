"use client";

import { UUID } from "@/lib/types/util";
import { Button, Group } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconList,
} from "@tabler/icons-react";
import Link from "next/link";

type QuestionNavigationProps = {
  prevId?: UUID;
  nextId?: UUID;
};

export default function QuestionNavigation({
  nextId,
  prevId,
}: QuestionNavigationProps) {
  return (
    <Group justify="space-between">
      <Button
        component={Link}
        onClick={(event) => !prevId && event.preventDefault()}
        disabled={!prevId}
        href={`./${prevId}`}
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
        onClick={(event) => !nextId && event.preventDefault()}
        disabled={!nextId}
        href={`./${nextId}`}
        mt="8"
        w="fit-content"
        leftSection={<IconChevronRight />}
      >
        Next
      </Button>
    </Group>
  );
}
