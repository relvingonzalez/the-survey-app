"use client";

import { Card, CardSection, Group, Stack, Text } from "@mantine/core";
import { IconNetwork, IconNetworkOff } from "@tabler/icons-react";
import { useNetwork } from "@mantine/hooks";

export default function NetworkStatusCard() {
  const networkStatus = useNetwork();

  return (
    <Card withBorder shadow="sm" radius="md">
      <CardSection withBorder inheritPadding py="xs">
        <Group justify="start">
          {networkStatus.online ? <IconNetwork /> : <IconNetworkOff />}
          <Text size="xl" fw={500}>
            Network Status
          </Text>
        </Group>
      </CardSection>
      <Stack mt="md">
        Information about the Network (if available):
        <Text size="sm" c={networkStatus.online ? "teal.6" : "red.6"}>
          {networkStatus.online ? "Online" : "Offline"}
        </Text>
        <Text size="sm">
          {networkStatus.type} {networkStatus.effectiveType}
        </Text>
      </Stack>
    </Card>
  );
}
