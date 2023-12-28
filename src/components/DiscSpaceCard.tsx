"use client";

import { Card, CardSection, Group, Text, RingProgress } from "@mantine/core";
import { IconDatabase } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export default function DiscSpaceCard() {
  const [percentFilled, setPercentFilled] = useState(0);

  useEffect(() => {
    if (window.navigator) {
      window.navigator.storage.estimate().then((estimate) => {
        const usage = estimate.usage || 0;
        const quota = estimate.quota || 1;
        const spaceLeft = (usage / quota) * 100;

        setPercentFilled(Math.round(spaceLeft * 1e2) / 1e2);
      });
    }
  });

  return (
    <Card withBorder shadow="sm" radius="md">
      <CardSection withBorder inheritPadding py="xs">
        <Group justify="start">
          <IconDatabase />
          <Text size="xl" fw={500}>
            Storage
          </Text>
        </Group>
      </CardSection>
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
