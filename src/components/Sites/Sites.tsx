"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/dexie/db";
import { populate } from "@/lib/dexie/helper";
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
import { LocalSiteProject } from "@/lib/types/local";
import { DexieSiteProject } from "@/lib/types/dexie";

type SitesProps = {
  sites: LocalSiteProject[] | DexieSiteProject[];
} & (
  | { download: true; onDownload: (site: LocalSiteProject) => Promise<void> }
  | { download?: false; onDownload?: never }
);

function SiteProgress({ site }: { site: DexieSiteProject }) {
  const questionsCount = useLiveQuery(() =>
    db.questions.where({ projectId: site.projectId }).count(),
  );
  const questionResponsesCount = useLiveQuery(() =>
    db.questionResponses.where({ projectId: site.projectId }).count(),
  );
  const processesCount = useLiveQuery(() =>
    db.processes.where({ projectId: site.projectId }).count(),
  );
  const processResponsesCount = useLiveQuery(() =>
    db.processResponses.where({ projectId: site.projectId }).count(),
  );
  const roomsCount = useLiveQuery(() =>
    db.rooms.where({ projectId: site.projectId }).count(),
  );
  return (
    <Table withColumnBorders>
      <TableTbody>
        <TableTr>
          <TableTd>Questions:</TableTd>
          <TableTd>
            {questionResponsesCount}/{questionsCount}
          </TableTd>
        </TableTr>
        <TableTr>
          <TableTd>Sketches:</TableTd>
          <TableTd>{roomsCount}</TableTd>
        </TableTr>
        <TableTr>
          <TableTd>Processes:</TableTd>
          <TableTd>
            {processResponsesCount}/{processesCount}
          </TableTd>
        </TableTr>
      </TableTbody>
    </Table>
  );
}

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
      {!download && (
        <TableTd>
          <SiteProgress site={site} />
        </TableTd>
      )}
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

export function DownloadSites({
  sites,
}: Omit<SitesProps, "download" | "onDownload">) {
  //Check if already downloaded. Want to overwrite?
  // If yes, delete all local data and download new.
  const handleDownload = async (site: Site) => {
    try {
      const response = await fetch(`download/${site.id}/api/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      await populate(data);
      alert(`downloaded site ${site.siteCode}`);
    } catch (error) {
      console.error(error);
    }
  };
  // open progress modal
  // progress modal should have state in the shape of {step, progress, text}
  return <Sites sites={sites} download onDownload={handleDownload} />;
}

export function LocalSites() {
  const sites = useLiveQuery(() => db.siteProjects.toArray());

  if (!sites) {
    return <Text>You have not downloaded any sites yet</Text>;
  }

  return <Sites sites={sites} />;
}
