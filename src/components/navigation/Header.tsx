import { Burger, Flex, Group } from "@mantine/core";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import { Image } from "@mantine/core";

type NavHeaderProps = {
  mobileOpened: boolean;
  desktopOpened: boolean;
  toggleMobile: () => void;
  toggleDesktop: () => void;
};

export default function NavHeader({
  mobileOpened,
  desktopOpened,
  toggleMobile,
  toggleDesktop,
}: NavHeaderProps) {
  return (
    <Flex w="100%" px="md" h="100%" align="center" justify="space-between">
      <Group>
        <Burger
          opened={mobileOpened}
          onClick={toggleMobile}
          hiddenFrom="sm"
          size="sm"
        />
        <Burger
          opened={desktopOpened}
          onClick={toggleDesktop}
          visibleFrom="sm"
          size="sm"
        />
        <Image src="/logo_otsan.png" alt="OtsanLLC" w={30} h="auto" />
      </Group>
      <DarkModeToggle />
    </Flex>
  );
}
