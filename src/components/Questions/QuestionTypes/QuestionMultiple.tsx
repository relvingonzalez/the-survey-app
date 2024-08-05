import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import { Question, Response } from "../../../../internal";

export type QuestionMultipleProps = {
  question: Question;
  response: Response[];
} & WithQuestionCallback &
  MultiSelectProps;

export const createMultipleResponse = (
  { projectId, id: questionId, responseType }: Question,
  text = "",
) => Response.create({ projectId, questionId, responseType, text });

export default function QuestionListSelect({
  question,
  response,
  onAnswered,
  ...props
}: QuestionMultipleProps) {
  const handleOnChange = async (selection: string[]) => {
    const result = await Promise.all(
      selection.map((s) => {
        const res =
          response.find((r) => r.text === s) ||
          createMultipleResponse(question, s);
        return res;
      }),
    );

    // Check which ones to remove and add flag
    const selectionsToRemove = question.options.filter(
      (o) => !selection.includes(o),
    );
    const responsesToRemove = response
      .filter((r) => r.text && selectionsToRemove.includes(r.text))
      .map((s) => {
        s.flag = "d";
        return s;
      });
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
        .map((r) => r.text || "")}
      onChange={handleOnChange}
    />
  );
}
