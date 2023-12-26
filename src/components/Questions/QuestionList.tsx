import { Processes, Questions } from "@/lib/types/question";
import {
  Button,
  Table,
  TableTr,
  TableTd,
  TableTh,
  TableThead,
  TableTbody,
  TableTfoot,
  Text,
} from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import Link from "next/link";

type QuestionsProps = {
  items: Questions | Processes;
  isQuestion?: boolean;
};

export default function QuestionList({ items, isQuestion }: QuestionsProps) {
  const rows = items.map((item, index) => (
    <TableTr key={`${item.id}-${index}`}>
      <TableTd>{item.id}</TableTd>
      <TableTd>{item.sub1}</TableTd>
      <TableTd>
        <Text size="sm" fs="italic">
          {" "}
          {item.question}
        </Text>
        <Text size="sm" fw="700">
          {item.displayValue}
        </Text>
      </TableTd>
      <TableTd>
        <Button
          component={Link}
          href={`${isQuestion ? "questions" : "processes"}/${item.id}`}
          variant={item.answer.value ? "light" : "default"}
        >
          <IconSettings />
        </Button>
      </TableTd>
    </TableTr>
  ));

  const ths = (
    <TableTr>
      <TableTh>ID</TableTh>
      <TableTh>Section</TableTh>
      <TableTh>Question/Answer</TableTh>
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

// export function DownloadSites({sites}: SitesProps ) {
//     return <Sites sites={sites} download/>
// }

// export function LocalSites({sites}: SitesProps) {
//     return <Sites sites={sites} />
// }
