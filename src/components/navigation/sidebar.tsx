import { useState } from 'react';
import {
  IconDownload,
  IconReport,
  IconSettings,
  IconHome,
} from '@tabler/icons-react';
import classes from './sidebar.module.css';
import { Anchor } from '@mantine/core';
import Link from 'next/link';

const data = [
  { link: 'start', label: 'Start', icon: IconHome },
  { link: 'download', label: 'Download Site(s)', icon: IconDownload },
  { link: 'local', label: 'Local Questionairre(s)', icon: IconReport },
  { link: 'preferences', label: 'Preferences', icon: IconSettings },
];

export default function Sidebar() {
  const [active, setActive] = useState('Start');

  const links = data.map((item) => (
    <Anchor component={Link}
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Anchor>
  ));

  return (
    <>
      <div className={classes.navbarMain}>
        {links}
      </div>
    </>
  );
}