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
  download?: boolean;
};

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

function Sites({ sites, download }: SitesProps) {
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
            <IconInfoCircleFilled className="text-red" />
            <IconDownload />
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
  return <Sites sites={sites} download />;
}

export function LocalSites({ sites }: SitesProps) {
  return <Sites sites={sites} />;
}
