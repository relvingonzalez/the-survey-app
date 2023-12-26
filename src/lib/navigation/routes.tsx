import { NavLinks } from "../types/nav";
import {
  IconDownload,
  IconReport,
  IconSettings,
  IconHome,
} from "@tabler/icons-react";

const homeHref = "start";

export const brandNav = {
  href: `${homeHref}`,
  title: "The Survey App",
  icon: IconHome,
  hideOnSidebar: true,
};

export const navLinks: NavLinks = {
  "the-survey-app": brandNav,
  start: { href: "start", title: "Start", icon: IconHome },
  download: { href: "download", title: "Download Site(s)", icon: IconDownload },
  local: { href: "local", title: "Sites", icon: IconReport },
  preferences: {
    href: "preferences",
    title: "Preferences",
    icon: IconSettings,
  },
  "site-overview": {
    href: "site-overview",
    title: "Site Overview",
    hideOnSidebar: true,
  },
  questions: { href: "questions", title: "Questions", hideOnSidebar: true },
  processes: { href: "processes", title: "Processes", hideOnSidebar: true },
  rooms: { href: "rooms", title: "Rooms", hideOnSidebar: true },
};
