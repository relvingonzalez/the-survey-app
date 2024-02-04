"use client";

import { db } from "@/lib/dexie/db";
import { SiteCode } from "@/lib/types/sites";
import {
  Button,
  Table,
  TableTd,
  TableTbody,
  TableTh,
  TableTr,
  TableTfoot,
  TableThead,
  Text,
} from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { useLiveQuery } from "dexie-react-hooks";
import Link from "next/link";

type RoomListProps = {
  siteCode: SiteCode;
};

export default function RoomList({ siteCode }: RoomListProps) {
  const site = useLiveQuery(() => db.siteProjects.get({ siteCode: siteCode }));
  const projectId = site ? site.projectId : 0;
  const rooms = useLiveQuery(
    () => db.rooms.where({ projectId }).toArray(),
    [projectId],
  );
  const moreInfos = useLiveQuery(
    () => db.moreInfos.where({ projectId }).toArray(),
    [projectId],
  );

  const racks = useLiveQuery(
    () => db.racks.where({ projectId }).toArray(),
    [projectId],
  );

  if (!rooms || !moreInfos || !racks) {
    return null;
  }
  const rows = rooms.map((room, index) => {
    const roomRacks = racks.filter((r) => r.roomId === room.id);
    const roomMoreInfos = racks.filter((r) => r.roomId === room.id);

    return (
      <TableTr key={`${room.id}-${index}`}>
        <TableTd>{room.name}</TableTd>
        <TableTd>Layouts Coming Soon...</TableTd>
        <TableTd>
          <Text size="sm">Racks: {roomRacks.length}</Text>
          <Text size="sm">Additional Info: {roomMoreInfos.length}</Text>
        </TableTd>
        <TableTd>
          <Button component={Link} href={`rooms/${room.id}`}>
            <IconSettings />
          </Button>
        </TableTd>
      </TableTr>
    );
  });

  const ths = (
    <TableTr>
      <TableTh>Room Name</TableTh>
      <TableTh>Layout</TableTh>
      <TableTh>Info</TableTh>
      <TableTh>Action</TableTh>
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
