import { NavLinks } from "../types/nav";
import {
    IconDownload,
    IconReport,
    IconSettings,
    IconHome,
  } from '@tabler/icons-react';

const homeHref = 'the-survey-app'; 

export const brandNav =  { href: `${homeHref}`, title: 'The Survey App', icon: IconHome, hideOnSidebar: true };

export const navLinks: NavLinks = {
  'the-survey-app': brandNav,
  'start': { href: 'start', title: 'Start', icon: IconHome },
  'download': { href: 'download', title: 'Download Site(s)', icon: IconDownload },
  'local': { href: 'local', title: 'Site(s)', icon: IconReport },
  'preferences': { href: 'preferences', title: 'Preferences', icon: IconSettings },
  'site-overview': { href: 'site-overview', title: 'Site Overview', hideOnSidebar: true }
};