"use client";

import { brandNav } from "@/lib/navigation/routes";
import { WithNavLinkProps } from "@/lib/types/nav";
import { Breadcrumbs, Anchor, Text } from "@mantine/core";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function NavBreadcrumbs({ navLinks }: WithNavLinkProps) {
  const pathname = usePathname();
  const [breadcrumbs, setBreadcrumbs] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (pathname) {
      const pathNameArray = pathname.split("/");
      pathNameArray.shift();
      const currentHref = pathNameArray[pathNameArray.length - 1];
      let cummulativeHref = "";
      setBreadcrumbs(
        pathNameArray.map((pathSection, index) => {
          const navLink = navLinks[pathSection];
          cummulativeHref += `/${pathSection}`;
          return pathSection === currentHref ? (
            <Text key={index}>{navLink ? navLink.title : pathSection}</Text>
          ) : (
            <Anchor
              component={Link}
              href={navLink?.href === brandNav.href ? "/" : cummulativeHref}
              key={index}
            >
              {navLink?.title || pathSection}
            </Anchor>
          );
        }),
      );
    }
  }, [navLinks, pathname]);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <Breadcrumbs style={{ flexWrap: "wrap" }} px="md" pt="md" mb="20">
      {breadcrumbs}
    </Breadcrumbs>
  );
}
