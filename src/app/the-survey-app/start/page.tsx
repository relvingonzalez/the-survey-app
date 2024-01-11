import DiscSpaceCard from "@/components/DiscSpaceCard";
import NetworkStatusCard from "@/components/NetworkStatusCard";
import Start from "@/components/Start";
import { SimpleGrid } from "@mantine/core";

export default function StartPage() {
  return (
    <SimpleGrid cols={2}>
      <Start />
      <DiscSpaceCard />
      <NetworkStatusCard />
    </SimpleGrid>
  );
}
