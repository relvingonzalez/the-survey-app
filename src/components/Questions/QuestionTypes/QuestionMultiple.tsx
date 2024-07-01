import {
  MultipleQuestion,
  MultipleResponse,
  QuestionResponse,
} from "@/lib/types/question_new";
import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import { DexieMultipleResponse } from "@/lib/types/dexie";

export type QuestionMultipleProps = {
  question: MultipleQuestion;
  response: DexieMultipleResponse[];
} & WithQuestionCallback<MultipleResponse[]> &
  MultiSelectProps;

export const createMultipleResponse = (
  { projectId, id: questionId, responseType }: MultipleQuestion,
  text = "",
): MultipleResponse => ({
  projectId,
  questionId,
  responseType,
  text,
});

export function isMultipleResponse(
  response: QuestionResponse[],
): response is MultipleResponse[] {
  return (
    (response as MultipleResponse[])[0]?.responseType === "multiple" ||
    !response.length
  );
}

export default function QuestionListSelect({
  question,
  response,
  onAnswered,
  ...props
}: QuestionMultipleProps) {
  const handleOnChange = (selection: string[]) => {
    const result = selection.map((s) => {
      const res =
        response.find((r) => r.text === s) ||
        createMultipleResponse(question, s);
      return { ...res, flag: "u" };
    });

    // Check which ones to remove and add flag
    const selectionsToRemove = question.options.filter(
      (o) => !selection.includes(o),
    );
    const responsesToRemove = response
      .filter((r) => selectionsToRemove.includes(r.text))
      .map((s) => ({ ...s, flag: "d" }));
    onAnswered([...result, ...responsesToRemove]);
  };
  return (
    <MultiSelect
      {...props}
      name="list"
      label="Select"
      placeholder="--Select One or Many--"
      data={question.options}
      value={response
        .filter((r) => r.flag !== "d" && r.text)
        .map((r) => r.text)}
      onChange={handleOnChange}
    />
  );
}
