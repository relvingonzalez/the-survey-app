"use client";

import {
  Card,
  CardSection,
  Group,
  Text,
  Button,
  ActionIcon,
  TableTr,
  TableTd,
  TableTh,
  Table,
  TableThead,
  TableTbody,
  TableTfoot,
  Stack,
} from "@mantine/core";
import { CollectionQuestion, Entries } from "@/lib/types/question";
import { useState } from "react";
import { IconLayoutGridAdd, IconTrash, IconX } from "@tabler/icons-react";
import QuestionType from "../QuestionType";

export type QuestionCollectionProps = {
  question: CollectionQuestion;
};

// const createNewEntry  = (entries: Entries): EntryAnswers => {
//     return entries.map(function(e) {
//             return { question: e.question, type: e.type, answer: undefined };
//         });
// }

type NewEntriesAnswerProps = {
  entries: Entries;
  onSave: () => void;
  onCancel: () => void;
};

function NewEntriesAnswer({
  entries,
  onSave,
  onCancel,
}: NewEntriesAnswerProps) {
  return (
    <Card mt="10" withBorder shadow="sm" radius="md">
      <CardSection withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Text size="xl" fw={500}>
            New Entry Answers
          </Text>
          <ActionIcon variant="subtle" color="gray" onClick={onCancel}>
            <IconX />
          </ActionIcon>
        </Group>
      </CardSection>
      <CardSection inheritPadding py="xs">
        <Stack gap="lg">
          {entries.map((e, i) => (
            <Stack gap="xs" key={i}>
              <Text fw={500}>{e.question}</Text>
              <QuestionType
                question={e}
                onChange={() => console.log("changed")}
              />
            </Stack>
          ))}
        </Stack>
        <Button mt="10" onClick={onSave}>
          Add Answers
        </Button>
      </CardSection>
    </Card>
  );
}

type EntriesProps = QuestionCollectionProps & {
  onDelete: (i: number) => void;
};
function Entries({ question, onDelete }: EntriesProps) {
  const rows = question.answer.value.map((entryAnswers, index) => (
    <TableTr key={`${index}`}>
      {entryAnswers.map((entryAnswer, j) => (
        <TableTd key={j}>{entryAnswer.answer.value.toString()}</TableTd>
      ))}
      <TableTd>
        <ActionIcon
          variant="subtle"
          color="red"
          onClick={() => onDelete(index)}
        >
          <IconTrash />
        </ActionIcon>
      </TableTd>
    </TableTr>
  ));

  const ths = (
    <TableTr>
      {question.entries.map((e, i) => (
        <TableTh key={i}>{e.question}</TableTh>
      ))}
      <TableTh></TableTh>
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

export default function QuestionCollection({
  question,
}: QuestionCollectionProps) {
  const [addNew, setAddNew] = useState(
    !question.answer.value.length ? true : false,
  );
  const onAddNewClick = () => {
    setAddNew(true);
  };

  const resetNewQuestion = () => {
    setAddNew(false);
  };

  const onSaveNewQuestion = () => {
    resetNewQuestion();
  };

  const onDeleteEntriesAnswer = (i: number) => {
    console.log("delete " + i);
  };

  return (
    <>
      <Entries question={question} onDelete={onDeleteEntriesAnswer} />

      {addNew ? (
        <NewEntriesAnswer
          entries={question.entries}
          onSave={onSaveNewQuestion}
          onCancel={resetNewQuestion}
        />
      ) : (
        <Button
          mt="10"
          w="fit-content"
          onClick={onAddNewClick}
          leftSection={<IconLayoutGridAdd />}
        >
          Add New
        </Button>
      )}
    </>
  );
}
