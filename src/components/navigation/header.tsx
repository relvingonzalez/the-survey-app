import { Burger, Flex, Group } from "@mantine/core";
import DarkModeToggle from "../DarkModeToggle/DarkModeToggle";
import Image from 'next/image'

type NavHeaderProps = {
    mobileOpened: boolean,
    desktopOpened:boolean,
    toggleMobile: () => void,
    toggleDesktop: () => void;
}

export default function NavHeader({mobileOpened, desktopOpened, toggleMobile, toggleDesktop}: NavHeaderProps) {

  return (
    <Group h="100%" px="md">
        <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
        <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
        <Image src="/logo_otsan.png" alt="OtsanLLC"  width={30} height={30}/>
        <Flex className="flex-1" justify="right">
            <DarkModeToggle />
        </Flex>
    </Group>
  );
}