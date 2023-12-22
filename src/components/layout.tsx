'use client'

import { AppShell, Burger, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Image from 'next/image'
import { redirect } from "next/navigation";
import Sidebar from "./navigation/sidebar";
import NavBreadcrumbs from "./navigation/breadcrumbs";
import {
    IconDownload,
    IconReport,
    IconSettings,
    IconHome,
    Icon,
  } from '@tabler/icons-react';
import { brandNav } from "@/lib/branding/constants";
import NavFooter from "./navigation/footer";
import DarkModeToggle from "./DarkModeToggle/DarkModeToggle";
import NavHeader from "./navigation/header";

export type WithNavLinkProps = {
    navLinks: NavLinks;
}

export type NavLinks = {
    href: string,
    title: string,
    icon: Icon,
}[];  

const navLinks: NavLinks = [
    brandNav,
    { href: 'start', title: 'Start', icon: IconHome },
    { href: 'download', title: 'Download Site(s)', icon: IconDownload },
    { href: 'local', title: 'Local Questionairre(s)', icon: IconReport },
    { href: 'preferences', title: 'Preferences', icon: IconSettings },
];

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
                <NavHeader mobileOpened={mobileOpened} desktopOpened={desktopOpened} toggleMobile={toggleMobile} toggleDesktop={toggleDesktop}/>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <Sidebar navLinks={navLinks} />
            </AppShell.Navbar>
            <AppShell.Main>
                <NavBreadcrumbs navLinks={navLinks} />
                {children}
            </AppShell.Main>
            <AppShell.Footer p="md"><NavFooter /></AppShell.Footer>
        </AppShell>
    )
  }