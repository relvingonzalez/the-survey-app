"use client";

import { Rooms } from "@/lib/types/rooms";
import { Button, Table, Text } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import Link from "next/link";

type RoomListProps = {
  items: Rooms;
};

export default function RoomList({ items }: RoomListProps) {
  const rows = items.map((item, index) => (
    <Table.Tr key={`${item.id}-${index}`}>
      <Table.Td>{item.name}</Table.Td>
      <Table.Td>Layouts Coming Soon...</Table.Td>
      <Table.Td>
        <Text size="sm">Racks: {item.racks.length || 0}</Text>
        <Text size="sm">Additional Info: {item.moreInfo.length || 0}</Text>
      </Table.Td>
      <Table.Td>
        <Link href={item.id}>
          <Button>
            <IconSettings />
          </Button>
        </Link>
      </Table.Td>
    </Table.Tr>
  ));

  const ths = (
    <Table.Tr>
      <Table.Th>Room Name</Table.Th>
      <Table.Th>Layout</Table.Th>
      <Table.Th>Info</Table.Th>
      <Table.Th>Action</Table.Th>
    </Table.Tr>
  );

  return (
    <Table captionSide="bottom" withColumnBorders>
      <Table.Thead bg="var(--mantine-color-gray-light)">{ths}</Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
      <Table.Tfoot bg="var(--mantine-color-gray-light)">{ths}</Table.Tfoot>
    </Table>
  );
}
