
import { Breadcrumbs, Anchor, Text } from '@mantine/core';
import { usePathname } from 'next/navigation';
import { WithNavLinkProps } from '../layout';
import { useEffect, useState } from 'react';
import { brandNav } from '@/lib/branding/constants';

export default function NavBreadcrumbs({navLinks}: WithNavLinkProps) {
    const pathname = usePathname();
    const [breadcrumbs, setBreadcrumbs] = useState<React.ReactNode>(null);
  
    useEffect(() => {
      if (pathname) {
        const pathNameArray = pathname.split('/');
        pathNameArray.shift();
        const currentHref = pathNameArray[pathNameArray.length-1];
        setBreadcrumbs(pathNameArray.map((pathSection, index) => {
            const navLink = navLinks.find((n) => n.href === pathSection) || navLinks[0];
            return pathSection === currentHref ? (
                <Text key={index}>{navLink.title}</Text>
            ) : (
                <Anchor href={navLink.href ===  brandNav.href ? '/' : navLink.href} key={index}>
                    {navLink.title}
                </Anchor>
            )
        }));
      }
    }, [navLinks, pathname]);
  
    if (!breadcrumbs) {
      return null;
    }

  return (
    <Breadcrumbs mb="20">{breadcrumbs}</Breadcrumbs>
  );
}