import { Rooms } from "@/lib/types/rooms";
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
import Link from "next/link";

type RoomListProps = {
  items: Rooms;
};

export default function RoomList({ items }: RoomListProps) {
  const rows = items.map((item, index) => (
    <TableTr key={`${item.id}-${index}`}>
      <TableTd>{item.name}</TableTd>
      <TableTd>Layouts Coming Soon...</TableTd>
      <TableTd>
        <Text size="sm">Racks: {item.racks.length || 0}</Text>
        <Text size="sm">Additional Info: {item.moreInfo.length || 0}</Text>
      </TableTd>
      <TableTd>
        <Button component={Link} href={`rooms/${item.id}`}>
          <IconSettings />
        </Button>
      </TableTd>
    </TableTr>
  ));

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
