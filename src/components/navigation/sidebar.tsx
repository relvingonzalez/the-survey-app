import classes from './sidebar.module.css';
import { Anchor } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { WithNavLinkProps } from '../layout';
import { brandNav } from '@/lib/branding/constants';


export default function Sidebar({navLinks}: WithNavLinkProps) {
  const pathname = usePathname();
  const pathNameArray = pathname.split('/');
  // Remove Top Level from links
  const sideBarLinks = [...navLinks];
  sideBarLinks.splice(sideBarLinks.findIndex(n => n.href === brandNav.href), 1);

  const links = sideBarLinks.map((item) => (
    <Anchor component={Link}
      className={classes.link}
      data-active={pathNameArray.includes(item.href) || undefined}
      href={item.href}
      key={item.title}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.title}</span>
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