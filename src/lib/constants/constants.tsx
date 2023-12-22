import { NavLinks } from "../types/nav";
import {
    IconDownload,
    IconReport,
    IconSettings,
    IconHome,
  } from '@tabler/icons-react';

export const brandTitle = "The Survey App";

export const brandNav =  { href: 'the-survey-app', title: 'The Survey App', icon: IconHome };


export const navLinks: NavLinks = [
    brandNav,
    { href: 'start', title: 'Start', icon: IconHome },
    { href: 'download', title: 'Download Site(s)', icon: IconDownload },
    { href: 'local', title: 'Local Questionairre(s)', icon: IconReport },
    { href: 'preferences', title: 'Preferences', icon: IconSettings },
];