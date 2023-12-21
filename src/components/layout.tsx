'use client'

import { AppShell, Burger, Group, Skeleton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from 'next/image'
import { redirect } from "next/navigation";
import Sidebar from "./navigation/sidebar";
import NavBreadcrumbs from "./navigation/breadcrumbs";
 
export default function Layout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
    if(false) {
        redirect('login');
    }
    return (
        <AppShell
        header={{ height: 60 }}
        navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
        padding="md"
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
                    <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
                    <Image src="/logo_otsan.png" alt="OtsanLLC"  width={30} height={30}/>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <Sidebar />
            </AppShell.Navbar>
            <AppShell.Main>
                <NavBreadcrumbs />
                {children}
            </AppShell.Main>
            <AppShell.Footer p="md">Footer</AppShell.Footer>
        </AppShell>
    )
  }