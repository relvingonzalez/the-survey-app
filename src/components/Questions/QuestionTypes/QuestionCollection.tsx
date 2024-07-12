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
import { CollectionQuestion } from "@/lib/types/question_new";
import { useState } from "react";
import { IconLayoutGridAdd, IconTrash, IconX } from "@tabler/icons-react";
import { WithQuestionCallback } from "../SurveyItem";
import { QuestionResponse } from "@/lib/types/question_new";
import { useLiveQuery } from "dexie-react-hooks";
import {
  addComments,
  addNewResponseGroup,
  createComment,
  createResponseByQuestion,
  deleteResponseGroup,
  getCollectionQuestions,
  getCollectionResponses,
} from "@/lib/dexie/helper";
import { DexieQuestion, DexieResponse } from "@/lib/types/dexie";
import { getDisplayValues, uniqueId } from "@/lib/utils/functions";
import QuestionByTypeComponent from "../QuestionByTypeComponent";
// import { v4 as uuidv4 } from "uuid";

export type QuestionCollectionProps = {
  question: CollectionQuestion;
} & WithQuestionCallback<QuestionResponse[]>;

type NewResponseGroupProps = {
  questions: DexieQuestion[];
  responses: DexieResponse[];
  onAnswered: (r: DexieResponse[]) => void;
  onSave: () => void;
  onCancel: () => void;
};

function NewResponseGroup({
  questions,
  responses,
  onAnswered,
  onSave,
  onCancel,
}: NewResponseGroupProps) {
  const onAnsweredQuestionInEntry = (
    value: QuestionResponse | QuestionResponse[],
  ) => {
    onAnswered(value instanceof Array ? value : [value]);
  };
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
          {questions.map((q, i) => {
            const response = responses.filter((r) => r.questionId === q.id);
            return (
              <Stack gap="xs" key={i}>
                <Text fw={500}>{q.question}</Text>
                <QuestionByTypeComponent
                  question={q}
                  response={response}
                  onAnswered={onAnsweredQuestionInEntry}
                />
              </Stack>
            );
          })}
        </Stack>
        <Button mt="10" onClick={onSave}>
          Add Answers
        </Button>
      </CardSection>
    </Card>
  );
}

type EntriesProps = Omit<QuestionCollectionProps, "question" | "onAnswered"> & {
  questions: DexieQuestion[];
  responseGroups?: Record<number, DexieResponse[]>;
  onDelete?: (responseGroupId: number) => void;
};

export const createCollectionResponses = (questions?: DexieQuestion[]) => {
  return questions?.flatMap(createResponseByQuestion);
};

export function Entries({ questions, responseGroups, onDelete }: EntriesProps) {
  if (!responseGroups) {
    return null;
  }

  const rows = Object.entries(responseGroups).map(([k, response], index) => (
    <TableTr key={`${index}`}>
      {questions.map((q, j) => {
        const responsesToQuestion = response.filter(
          (r) => r.questionId === q.id,
        );
        return (
          <TableTd key={j}>{getDisplayValues(responsesToQuestion)}</TableTd>
        );
      })}
      {onDelete && (
        <TableTd>
          <ActionIcon
            variant="subtle"
            color="red"
            onClick={() => onDelete(Number(k))}
          >
            <IconTrash />
          </ActionIcon>
        </TableTd>
      )}
    </TableTr>
  ));

  const ths = (
    <TableTr>
      {questions.map((q, i) => (
        <TableTh key={i}>{q.question}</TableTh>
      ))}
      {onDelete && <TableTh></TableTh>}
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
  onAnswered,
}: QuestionCollectionProps) {
  const questions = useLiveQuery(
    () => getCollectionQuestions(question.projectId, question.collectionId),
    [question],
  );

  const responseGroups = useLiveQuery(
    () => getCollectionResponses(questions),
    [questions],
  );
  const [addNew, setAddNew] = useState(
    responseGroups && !Object.keys(responseGroups).length ? true : false,
  );
  const [newResponseGroup, setNewResponseGroup] = useState<DexieResponse[]>([]);
  const onAddNewClick = () => {
    setNewResponseGroup([]);
    setAddNew(true);
  };

  const resetAddNew = () => {
    setAddNew(false);
  };

  const handleSaveNewResponseGroup = () => {
    if (responseGroups && newResponseGroup) {
      const tempResponseGroupId = uniqueId();
      const comments = questions?.map((q) =>
        createComment(q.id, q.projectId, uniqueId(), tempResponseGroupId),
      );
      addNewResponseGroup(
        tempResponseGroupId,
        question.collectionId,
        question.projectId,
      );
      addComments(comments);
      onAnswered(
        newResponseGroup.map((r) => ({
          ...r,
          questionResponseId: comments?.find(
            (c) => c.questionId === r.questionId,
          )?.tempId,
          responseGroupId: tempResponseGroupId,
        })),
      );
      resetAddNew();
    }
  };

  const onDeleteEntriesAnswer = (i: number) => {
    if (responseGroups) {
      deleteResponseGroup(i);
      onAnswered(responseGroups[i].map((r) => ({ ...r, flag: "d" })));
    }
  };

  const handleAnsweredNewResponseGroup = (responses: DexieResponse[]) => {
    const newResponses: DexieResponse[] = [...newResponseGroup];
    responses.forEach((r) => {
      const foundIndex = newResponses.findIndex((nR) => nR.tempId === r.tempId);
      if (foundIndex > -1) {
        newResponses[foundIndex] = { ...newResponses[foundIndex], ...r };
      } else {
        newResponses.push({ ...r, tempId: uniqueId() });
      }
    });
    setNewResponseGroup(newResponses);
  };

  if (!questions) {
    return null;
  }

  return (
    <>
      <Entries
        questions={questions}
        responseGroups={responseGroups}
        onDelete={onDeleteEntriesAnswer}
      />

      {addNew && newResponseGroup ? (
        <NewResponseGroup
          questions={questions}
          responses={newResponseGroup}
          onAnswered={handleAnsweredNewResponseGroup}
          onSave={handleSaveNewResponseGroup}
          onCancel={resetAddNew}
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
