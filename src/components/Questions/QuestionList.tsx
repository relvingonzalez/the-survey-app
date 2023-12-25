'use client'

import { Processes, Questions } from '@/lib/types/question';
import { Button, Table, Text } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import Link from 'next/link';

type QuestionsProps = {
    items: Questions | Processes;
};

export default function QuestionList({ items }: QuestionsProps) {
  const rows = items.map((item, index) => (
    <Table.Tr key={`${item.id}-${index}`}>
      <Table.Td>{item.id}</Table.Td>
      <Table.Td>{item.sub1}</Table.Td>
      <Table.Td>
        <Text size="sm" fs="italic"> {item.question}</Text>
        <Text size="sm" fw="700">{item.displayValue}</Text>
      </Table.Td>
      <Table.Td>
        <Link href={item.id}><Button variant={item.answer.value? 'light': 'default'}><IconSettings /></Button></Link>
      </Table.Td>
    </Table.Tr>
  ));

  const ths = (
    <Table.Tr>
      <Table.Th>ID</Table.Th>
      <Table.Th>Section</Table.Th>
      <Table.Th>Question/Answer</Table.Th>
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

// export function DownloadSites({sites}: SitesProps ) {
//     return <Sites sites={sites} download/>
// }

// export function LocalSites({sites}: SitesProps) {
//     return <Sites sites={sites} />
// }