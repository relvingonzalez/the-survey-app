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
import { useState } from "react";
import { IconLayoutGridAdd, IconTrash, IconX } from "@tabler/icons-react";
import { QuestionCallback, WithQuestionCallbacks } from "../SurveyItem";
import { useLiveQuery } from "dexie-react-hooks";
import { deleteResponseGroup } from "@/lib/dexie/helper";
import { uniqueId } from "@/lib/utils/functions";
import QuestionByTypeComponent from "../QuestionByTypeComponent";
import {
  Question,
  Response,
  Comment,
  ResponseGroup,
} from "../../../../internal";

export type QuestionCollectionProps = {
  question: Question;
} & WithQuestionCallbacks;

type NewResponseGroupProps = {
  questions: Question[];
  responses: Response[];
  onSave: () => void;
  onCancel: () => void;
} & WithQuestionCallbacks;

function NewResponseGroup({
  questions,
  responses,
  onAnswered,
  onDeleted,
  onSave,
  onCancel,
}: NewResponseGroupProps) {
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
            const { projectId, id: questionId, responseType } = q;
            const filteredResponses = responses.filter(
              (r) => r.questionId === q.id,
            );
            const response = filteredResponses.length
              ? filteredResponses
              : [Response.create({ questionId, projectId, responseType })];
            return (
              <Stack gap="xs" key={i}>
                <Text fw={500}>{q.question}</Text>
                <QuestionByTypeComponent
                  question={q}
                  response={response}
                  onAnswered={onAnswered}
                  onDeleted={onDeleted}
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

type EntriesProps = Omit<
  QuestionCollectionProps,
  "question" | "onAnswered" | "onDeleted"
> & {
  questions: Question[];
  responseGroups?: Record<number, Response[]>;
  onDelete?: (responseGroupId: number) => void;
};

export const createCollectionResponses = (questions?: Question[]) => {
  return questions?.flatMap(Response.fromQuestion);
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
          <TableTd key={j}>
            {Response.getDisplayValues(responsesToQuestion)}
          </TableTd>
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
  onDeleted,
}: QuestionCollectionProps) {
  const questions = useLiveQuery(
    () => question.getCollectionQuestions(),
    [question],
  );

  const responseGroups = useLiveQuery(
    () => Response.getCollectionResponses(questions),
    [questions],
  );
  const [addNew, setAddNew] = useState(
    responseGroups && !Object.keys(responseGroups).length ? true : false,
  );
  const [newResponseGroup, setNewResponseGroup] = useState<Response[]>([]);
  const onAddNewClick = () => {
    setNewResponseGroup([]);
    setAddNew(true);
  };

  const resetAddNew = () => {
    setAddNew(false);
  };

  const handleSaveNewResponseGroup = async () => {
    if (responseGroups && newResponseGroup && questions) {
      const tempResponseGroupId = uniqueId();
      const comments = await Promise.all(
        questions.map((q) =>
          Comment.add({
            questionId: q.id,
            projectId: q.projectId,
            responseGroupId: tempResponseGroupId,
          }),
        ),
      );
      await ResponseGroup.add({
        projectId: question.projectId,
        collectionId: question.collectionId,
        id: tempResponseGroupId,
      });
      onAnswered(
        newResponseGroup.map((r) => {
          const commentId = comments?.find(
            (c) => c?.questionId === r.questionId,
          )?.id;
          if (commentId) {
            r.questionResponseId = commentId;
          }
          r.responseGroupId = tempResponseGroupId;
          return r;
        }),
      );
      resetAddNew();
    }
  };

  const onDeleteEntriesAnswer = (i: number) => {
    if (responseGroups) {
      deleteResponseGroup(i);
      onDeleted(responseGroups[i]);
    }
  };

  const handleAnsweredNewResponseGroup: QuestionCallback = (value) => {
    const newResponses: Response[] = [...newResponseGroup];
    const responses = value instanceof Array ? value : [value];
    responses.forEach((r) => {
      if (r) {
        const foundIndex = newResponses.findIndex((nR) => nR.id === r.id);
        if (foundIndex > -1) {
          newResponses[foundIndex].setProps(r);
        } else {
          newResponses.push(r);
        }
      }
    });
    setNewResponseGroup(newResponses);
  };

  const handleDeletedNewResponseGroup: QuestionCallback = (value) => {
    const removed = value instanceof Array ? value : [value];
    setNewResponseGroup(
      newResponseGroup.filter((nR) => !removed.find((r) => r?.id === nR.id)),
    );
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
          onDeleted={handleDeletedNewResponseGroup}
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
