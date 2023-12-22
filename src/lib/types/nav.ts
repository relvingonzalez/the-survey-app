import { Icon } from "@tabler/icons-react";

export type WithNavLinkProps = {
    navLinks: NavLinks;
}

export type NavLinks = {
    href: string;
    title: string;
    icon: Icon;
}[];  