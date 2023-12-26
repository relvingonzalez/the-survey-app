"use client";

import { Card, Group, Text, RingProgress } from "@mantine/core";
import { IconClockHour9 } from "@tabler/icons-react";
import { useState } from "react";

export default function DiscSpaceCard() {
  const [percentFilled, setPercentFilled] = useState(0);
  navigator.storage.estimate().then((estimate) => {
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 1;
    const spaceLeft = (usage / quota) * 100;

    setPercentFilled(Math.round(spaceLeft * 1e2) / 1e2);
  });

  return (
    <Card withBorder shadow="sm" radius="md">
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="start">
          <IconClockHour9 />
          <Text size="xl" fw={500}>
            Storage
          </Text>
        </Group>
      </Card.Section>
      <RingProgress
        sections={[{ value: percentFilled, color: "blue" }]}
        label={
          <Text c="blue" fw={700} ta="center" size="xl">
            {percentFilled}%
          </Text>
        }
      />
    </Card>
  );
}
