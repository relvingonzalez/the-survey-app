"use client";

import { Button, Group } from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconList,
} from "@tabler/icons-react";
import Link from "next/link";

type QuestionNavigationProps = {
  prev?: number;
  next?: number;
};

export default function QuestionNavigation({
  next,
  prev,
}: QuestionNavigationProps) {
  return (
    <Group justify="space-between">
      <Button
        component={Link}
        onClick={(event) => !prev && event.preventDefault()}
        disabled={!prev}
        href={`./${prev}`}
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
        onClick={(event) => !next && event.preventDefault()}
        disabled={!next}
        href={`./${next}`}
        mt="8"
        w="fit-content"
        leftSection={<IconChevronRight />}
      >
        Next
      </Button>
    </Group>
  );
}
