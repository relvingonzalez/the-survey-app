"use client";

import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { redirect } from "next/navigation";
import Sidebar from "./navigation/Sidebar";
import NavBreadcrumbs from "./navigation/Breadcrumbs";
import NavFooter from "./navigation/Footer";
import NavHeader from "./navigation/Header";
import { navLinks } from "@/lib/navigation/routes";

export default function Layout({ children }: { children: React.ReactNode }) {
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
      padding="md"
    >
      <AppShell.Header>
        <NavHeader
          mobileOpened={mobileOpened}
          desktopOpened={desktopOpened}
          toggleMobile={toggleMobile}
          toggleDesktop={toggleDesktop}
        />
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <Sidebar navLinks={navLinks} />
      </AppShell.Navbar>
      <AppShell.Main>
        <NavBreadcrumbs navLinks={navLinks} />
        {children}
      </AppShell.Main>
      <AppShell.Footer p="md">
        <NavFooter />
      </AppShell.Footer>
    </AppShell>
  );
}
