// "use client";

// import {
//   Card,
//   CardSection,
//   Group,
//   Text,
//   Button,
//   ActionIcon,
//   TableTr,
//   TableTd,
//   TableTh,
//   Table,
//   TableThead,
//   TableTbody,
//   TableTfoot,
//   Stack,
// } from "@mantine/core";
// import {
//   CollectionQuestion,
//   EntryAnswers,
//   ValueByQuestionType,
// } from "@/lib/types/question";
// import { useState } from "react";
// import { IconLayoutGridAdd, IconTrash, IconX } from "@tabler/icons-react";
// import QuestionType from "../QuestionByTypeComponent";
// import { WithQuestionCallback } from "../SurveyItem";
// import { CollectionResponse, QuestionResponse } from "@/lib/types/question_new";

// export type QuestionCollectionProps = {
//   question: CollectionQuestion;
//   response: CollectionResponse[];
// } & WithQuestionCallback<ValueByQuestionType<CollectionQuestion>>;

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
//               <QuestionType
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

// type EntriesProps = Omit<QuestionCollectionProps, "onAnswered"> & {
//   onDelete: (i: number) => void;
// };
// function Entries({ question, onDelete }: EntriesProps) {
//   const value = question.answer.value || [];
//   const rows = value.map((entryAnswers, index) => (
//     <TableTr key={`${index}`}>
//       {entryAnswers.map((entryAnswer, j) => (
//         <TableTd key={j}>{entryAnswer.answer.value?.toString()}</TableTd>
//       ))}
//       <TableTd>
//         <ActionIcon
//           variant="subtle"
//           color="red"
//           onClick={() => onDelete(index)}
//         >
//           <IconTrash />
//         </ActionIcon>
//       </TableTd>
//     </TableTr>
//   ));

//   const ths = (
//     <TableTr>
//       {question.entries.map((e, i) => (
//         <TableTh key={i}>{e.question}</TableTh>
//       ))}
//       <TableTh></TableTh>
//     </TableTr>
//   );

//   return (
//     <Table captionSide="bottom" withColumnBorders>
//       <TableThead bg="var(--mantine-color-gray-light)">{ths}</TableThead>
//       <TableTbody>{rows}</TableTbody>
//       <TableTfoot bg="var(--mantine-color-gray-light)">{ths}</TableTfoot>
//     </Table>
//   );
// }

// export default function QuestionCollection({
//   question,
//   onAnswered,
// }: QuestionCollectionProps) {
//   // fetch all questions in th ecollection with collectionID from this question and those are the questions or entries.
//   const value = question.answer.value || [];
//   const [addNew, setAddNew] = useState(!value.length ? true : false);
//   const [newEntriesAnswer, setNewEntriesAnswer] = useState<EntryAnswers>([]);
//   const onAddNewClick = () => {
//     const newEntriesCopy: EntryAnswers = question.entries.map((q) =>
//       structuredClone(q),
//     );
//     setNewEntriesAnswer(newEntriesCopy);
//     setAddNew(true);
//   };

//   const resetNewQuestion = () => {
//     setAddNew(false);
//   };

//   const onSaveNewQuestion = () => {
//     const newEntriesAnswers = [...value];
//     newEntriesAnswers.push(newEntriesAnswer);
//     onAnswered(newEntriesAnswers);
//     resetNewQuestion();
//   };

//   const onDeleteEntriesAnswer = (i: number) => {
//     const newEntriesAnswers = [...value];
//     newEntriesAnswers.splice(i, 1);
//     onAnswered(newEntriesAnswers);
//   };

//   return (
//     <>
//       <Entries question={question} onDelete={onDeleteEntriesAnswer} />

//       {addNew ? (
//         <NewEntriesAnswer
//           entries={newEntriesAnswer}
//           onAnsweredNewEntries={setNewEntriesAnswer}
//           onSave={onSaveNewQuestion}
//           onCancel={resetNewQuestion}
//         />
//       ) : (
//         <Button
//           mt="10"
//           w="fit-content"
//           onClick={onAddNewClick}
//           leftSection={<IconLayoutGridAdd />}
//         >
//           Add New
//         </Button>
//       )}
//     </>
//   );
// }
