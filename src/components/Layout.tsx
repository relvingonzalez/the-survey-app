"use client";

import {
  AppShell,
  AppShellNavbar,
  AppShellHeader,
  AppShellFooter,
  AppShellMain,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { redirect } from "next/navigation";
import Sidebar from "./navigation/Sidebar";
import NavBreadcrumbs from "./navigation/Breadcrumbs";
import NavFooter from "./navigation/Footer";
import NavHeader from "./navigation/Header";
import { navLinks } from "@/lib/navigation/routes";

export default function Layout({ children }: { children: React.ReactNode }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const notLoggedIn = false;

  if (notLoggedIn) {
    redirect("login");
  }
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      styles={{
        main: {
          background:
            colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          color:
            colorScheme === "dark"
              ? theme.colors.gray[0]
              : theme.colors.dark[8],
        },
      }}
      padding="md"
    >
      <AppShellHeader>
        <NavHeader
          mobileOpened={mobileOpened}
          desktopOpened={desktopOpened}
          toggleMobile={toggleMobile}
          toggleDesktop={toggleDesktop}
        />
      </AppShellHeader>
      <AppShellNavbar p="md">
        <Sidebar navLinks={navLinks} />
      </AppShellNavbar>
      <AppShellMain>
        <NavBreadcrumbs navLinks={navLinks} />
        {children}
      </AppShellMain>
      <AppShellFooter p="md">
        <NavFooter />
      </AppShellFooter>
    </AppShell>
  );
}
