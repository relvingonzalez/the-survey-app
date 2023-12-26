"use client";

import DiscSpaceCard from "@/components/DiscSpaceCard";
import Start from "@/components/Start";
import { SimpleGrid } from "@mantine/core";

export default function StartPage() {
  return (
    <SimpleGrid cols={2}>
      <Start />
      <DiscSpaceCard />
    </SimpleGrid>
  );
}
