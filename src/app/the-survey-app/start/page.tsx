import DiscSpaceCard from "@/components/DiscSpaceCard";
import NetworkStatusCard from "@/components/NetworkStatusCard";
import Start from "@/components/Start";
import { SimpleGrid } from "@mantine/core";

export default function StartPage() {
  return (
    <SimpleGrid
      cols={{ base: 1, md: 2, xl: 4 }}
      spacing={{ base: 10, sm: "xl" }}
      verticalSpacing={{ base: "md", sm: "xl" }}
    >
      <Start />
      <DiscSpaceCard />
      <NetworkStatusCard />
    </SimpleGrid>
  );
}
