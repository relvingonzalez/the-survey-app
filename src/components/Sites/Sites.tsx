"use client";

import { downloadSite } from "@/lib/api/actions";
import { Site } from "@/lib/types/sites";
import {
  Group,
  Table,
  TableTbody,
  TableTr,
  TableTd,
  TableTh,
  TableThead,
  TableTfoot,
  Text,
} from "@mantine/core";
import {
  IconInfoCircleFilled,
  IconDownload,
  IconSettingsFilled,
} from "@tabler/icons-react";
import Link from "next/link";

type SitesProps = {
  sites: Site[];
} & (
  | { download: true; onDownload: (site: Site) => void }
  | { download?: false; onDownload?: never }
);

const siteProgress = (site: Site) => {
  return (
    <Table withColumnBorders>
      <TableTbody>
        <TableTr>
          <TableTd>Questions:</TableTd>
          <TableTd>{site.phone}</TableTd>
          {/* <TableTd>1/{site.questionnaire.length}</TableTd> */}
        </TableTr>
        <TableTr>
          <TableTd>Sketches:</TableTd>
          <TableTd>3</TableTd>
        </TableTr>
        <TableTr>
          <TableTd>Processes:</TableTd>
          {/* <TableTd>5/{site.process.length}</TableTd> */}
        </TableTr>
      </TableTbody>
    </Table>
  );
};

function Sites({ sites, download, onDownload }: SitesProps) {
  const rows = sites.map((site, index) => (
    <TableTr key={`${site.siteCode}-${index}`}>
      <TableTd>{site.siteCode}</TableTd>
      <TableTd>
        <Text>{site.name}</Text>
        <Text>{site.street}</Text>
        <Text>
          {site.city}, {site.state}
        </Text>
      </TableTd>
      {!download && <TableTd>{siteProgress(site)}</TableTd>}
      <TableTd>
        {download ? (
          <Group>
            <IconInfoCircleFilled />
            <IconDownload onClick={() => onDownload(site)} />
          </Group>
        ) : (
          <Group>
            <Link href={`local/${site.siteCode}`}>
              <IconSettingsFilled />
            </Link>
          </Group>
        )}
      </TableTd>
    </TableTr>
  ));

  const ths = (
    <TableTr>
      <TableTh>Site Code</TableTh>
      <TableTh>Location</TableTh>
      {!download && <TableTh>Progress</TableTh>}
      <TableTh>Action(s)</TableTh>
    </TableTr>
  );

  return (
    <Table captionSide="bottom" withColumnBorders>
      <TableThead bg="var(--mantine-color-gray-light)">{ths}</TableThead>
      <TableTbody>{rows}</TableTbody>
      <TableTfoot bg="var(--mantine-color-gray-light)">{ths}</TableTfoot>
    </Table>
  );
}

export function DownloadSites({ sites }: SitesProps) {
  const onDownload = (site: Site) => {
    downloadSite(site);
  };
  // open progress modal
  // progress modal should have state in the shape of {step, progress, text}
  return <Sites sites={sites} download onDownload={onDownload} />;
}

export function LocalSites({ sites }: SitesProps) {
  return <Sites sites={sites} />;
}
