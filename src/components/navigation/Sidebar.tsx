import { WithNavLinkProps } from '@/lib/types/nav';
import classes from './Sidebar.module.css';
import { Anchor } from '@mantine/core';
import Link from 'next/link';
import { usePathname } from 'next/navigation'


export default function Sidebar({navLinks}: WithNavLinkProps) {
  const pathname = usePathname();
  const pathNameArray = pathname.split('/');
  const sideBarLinks = Object.values(navLinks).filter(n => !n.hideOnSidebar);
  const links = sideBarLinks.map((item) => (
    <Anchor component={Link}
      className={classes.link}
      data-active={pathNameArray.includes(item.href) || undefined}
      href={'/the-survey-app/' + item.href}
      key={item.title}
    >
      {item.icon && <item.icon className={classes.linkIcon} stroke={1.5} />}
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