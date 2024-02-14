"use client";

import {
  // Card,
  // CardSection,
  // Group,
  // Text,
  // Button,
  // ActionIcon,
  TableTr,
  TableTd,
  TableTh,
  Table,
  TableThead,
  TableTbody,
  TableTfoot,
  // Stack,
} from "@mantine/core";
import { CollectionQuestion } from "@/lib/types/question_new";
// import { useState } from "react";
// import { IconTrash } from "@tabler/icons-react";
// import QuestionType from "../QuestionByTypeComponent";
import { WithQuestionCallback } from "../SurveyItem";
import { QuestionResponse } from "@/lib/types/question_new";
import { useLiveQuery } from "dexie-react-hooks";
import { getCollectionQuestions, getCollectionResponses } from "@/lib/dexie/helper";
import { DexieQuestion, DexieResponse } from "@/lib/types/dexie";
import { getDisplayValues } from "@/lib/utils/functions";
// import { useState } from "react";
// import QuestionByTypeComponent from "../QuestionByTypeComponent";

export type QuestionCollectionProps = {
  question: CollectionQuestion;
} & WithQuestionCallback<QuestionResponse[]>;

// export function isCollectionResponse(
//   response: QuestionResponse[],
// ): response is CollectionResponse[] {
//   return (response as CollectionResponse[])[0].responseType === "collection";
// }

// type NewEntriesAnswerProps<E extends EntryAnswers> = {
//   entries: E;
//   onSave: () => void;
//   onCancel: () => void;
//   onAnsweredNewEntries: (entries: EntryAnswers) => void;
// };

// function NewEntriesAnswer<E extends EntryAnswers>({
//   entries,
//   onAnsweredNewEntries,
//   onSave,
//   onCancel,
// }: NewEntriesAnswerProps<E>) {
//   const onAnsweredQuestionInEntry = (
//     i: number,
//     value: ValueByQuestionType<E[number]>,
//   ) => {
//     const newEntries: EntryAnswers = entries.map((q) => structuredClone(q));
//     newEntries[i].answer.value = value;
//     onAnsweredNewEntries(newEntries);
//   };
//   return (
//     <Card mt="10" withBorder shadow="sm" radius="md">
//       <CardSection withBorder inheritPadding py="xs">
//         <Group justify="space-between">
//           <Text size="xl" fw={500}>
//             New Entry Answers
//           </Text>
//           <ActionIcon variant="subtle" color="gray" onClick={onCancel}>
//             <IconX />
//           </ActionIcon>
//         </Group>
//       </CardSection>
//       <CardSection inheritPadding py="xs">
//         <Stack gap="lg">
//           {entries.map((e, i) => (
//             <Stack gap="xs" key={i}>
//               <Text fw={500}>{e.question}</Text>
//               <QuestionByTypeComponent
//                 question={e}
//                 onAnswered={(v) => onAnsweredQuestionInEntry(i, v)}
//               />
//             </Stack>
//           ))}
//         </Stack>
//         <Button mt="10" onClick={onSave}>
//           Add Answers
//         </Button>
//       </CardSection>
//     </Card>
//   );
// }

type EntriesProps = Omit<QuestionCollectionProps, "question" | "onAnswered"> & {
  questions: DexieQuestion[];
  response?: DexieResponse[];
  //onDelete: (i: number) => void;
};
// response is probably wrong, need responseGroup, grouped by some ID and iterate via response by each groupID
// response_group_id ?
function Entries({ questions, response }: EntriesProps) {
  if(!response) {
    return null;
  }

  console.log(response)
  //instead of response.map, its supposed to be responseGroup.map or something.

  const responseGroup = [''];
  const rows = responseGroup.map((r, index) => (
    <TableTr key={`${index}`}>
      {questions.map((q, j) => {
        const responsesToQuestion = response.filter(r => r.questionId === q.id);
        return <TableTd key={j}>{getDisplayValues(responsesToQuestion)}</TableTd>
      })}
      <TableTd>
        {/* <ActionIcon
          variant="subtle"
          color="red"
          onClick={() => onDelete(index)}
        >
          <IconTrash />
        </ActionIcon> */}
      </TableTd>
    </TableTr>
  ));

  const ths = (
    <TableTr>
      {questions.map((q, i) => (
        <TableTh key={i}>{q.question}</TableTh>
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
  // onAnswered,
}: QuestionCollectionProps) {
  // fetch all questions in the collection with collectionID from this question and those are the questions or entries.
  const questions = useLiveQuery(
    () => getCollectionQuestions(question.projectId, question.collectionId),
    [question],
  );

  const responses = useLiveQuery(
    () => getCollectionResponses(questions),
    [questions],
  );
  // const [addNew, setAddNew] = useState(!responses?.length ? true : false);
  // const [newEntriesAnswer, setNewEntriesAnswer] = useState<EntryAnswers>([]);
  // const onAddNewClick = () => {
  //   const newEntriesCopy: EntryAnswers = question.entries.map((q) =>
  //     structuredClone(q),
  //   );
  //   setNewEntriesAnswer(newEntriesCopy);
  //   setAddNew(true);
  // };

  // const resetNewQuestion = () => {
  //   setAddNew(false);
  // };

  // const onSaveNewQuestion = () => {
  //   const newEntriesAnswers = [...value];
  //   newEntriesAnswers.push(newEntriesAnswer);
  //   onAnswered(newEntriesAnswers);
  //   resetNewQuestion();
  // };

  // const onDeleteEntriesAnswer = (i: number) => {
  //   const newEntriesAnswers = [...value];
  //   newEntriesAnswers.splice(i, 1);
  //   onAnswered(newEntriesAnswers);
  // };

  if (!questions) {
    return null;
  }

  // Group Responses by collection_order? or something similar in the response table

  //

  return (
    <>
      <Entries questions={questions} response={responses} />

      {/* {addNew ? (
        <NewEntriesAnswer
          entries={newEntriesAnswer}
          onAnsweredNewEntries={setNewEntriesAnswer}
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
      )} */}
    </>
  );
}
