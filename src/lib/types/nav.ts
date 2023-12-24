import { Icon } from "@tabler/icons-react";

type NavHref = string;

type NavLink = {
    href: string;
    title: string;
    icon?: Icon;
    hideOnSidebar?: boolean;
};

export type WithNavLinkProps = {
    navLinks: NavLinks;
}

export type NavLinks = Record<NavHref, NavLink>;  