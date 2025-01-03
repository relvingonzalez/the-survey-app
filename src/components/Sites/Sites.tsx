"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/dexie/db";
import { deleteProject, populate } from "@/lib/dexie/helper";
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
  ActionIcon,
} from "@mantine/core";
import { IconDownload, IconSettingsFilled } from "@tabler/icons-react";
import Link from "next/link";
import DownloadModal from "../DownloadModal";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useQuestionsWithCounts } from "@/lib/hooks/useQuestionsWithCounts";
import { ServerSiteProject } from "@/lib/types/server";
import { DexieSiteProject } from "../../../internal";

type SitesProps = {
  sites: ServerSiteProject[] | DexieSiteProject[];
} & (
  | { download: true; onDownload: (site: ServerSiteProject) => Promise<void> }
  | { download?: false; onDownload?: never }
);

function SiteProgress({ site }: { site: DexieSiteProject }) {
  const {
    roomsCount,
    questionsCount,
    processesCount,
    questionResponsesCount,
    processResponsesCount,
  } = useQuestionsWithCounts(site);
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
            {/* <IconInfoCircleFilled /> */}
            <ActionIcon onClick={() => onDownload(site)}>
              <IconDownload />
            </ActionIcon>
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
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSite, setSelectedSite] = useState<ServerSiteProject>();
  const [active, setActive] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [progressValue, setProgressValue] = useState(0);

  const handleStatusUpdate = (step: number, progress: number, text: string) => {
    setActive(step);
    setStatusText(text);
    setProgressValue(progress);
  };

  const handleDownload = async (site: ServerSiteProject) => {
    setSelectedSite(site);
    handleStatusUpdate(
      1,
      10,
      "Verifying site has not been downloaded already...",
    );
    const localSite = await db.siteProjects.get({ projectId: site.projectId });
    open();
    if (localSite) {
      setStatusText(
        "Site already downloaded, override data? DANGER: All unsynced progress for this site will be lost.",
      );
    } else {
      continueDownload(site);
    }
  };

  const handleOnContinue = async () => {
    if (selectedSite) {
      handleStatusUpdate(1, 25, "Deleting Project from Local Storage");
      await deleteProject(selectedSite.projectId);
      continueDownload(selectedSite);
    }
  };

  const continueDownload = async (site: ServerSiteProject) => {
    try {
      handleStatusUpdate(2, 33, "Downloading Data");
      const response = await fetch(`api/download/${site.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      handleStatusUpdate(3, 66, "Saving to Local Storage");
      await populate(data);
    } catch (error) {
      //TODO make progressValue red and icon X red
      console.error(error);
    } finally {
      handleStatusUpdate(
        3,
        100,
        "You have successfully downloaded this site into your device.",
      );
    }
  };

  return (
    <>
      <DownloadModal
        statusText={statusText}
        progressValue={progressValue}
        active={active}
        opened={opened}
        onClose={close}
        onContinue={handleOnContinue}
      />
      <Sites sites={sites} download onDownload={handleDownload} />
    </>
  );
}

export function LocalSites() {
  const sites = useLiveQuery(() => db.siteProjects.toArray());

  if (!sites) {
    return <Text>You have not downloaded any sites yet</Text>;
  }

  return <Sites sites={sites} />;
}
