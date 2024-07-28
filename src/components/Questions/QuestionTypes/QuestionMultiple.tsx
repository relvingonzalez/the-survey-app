import { MultipleQuestion } from "@/lib/types/question";
import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import Response from "@/lib/dexie/Response";

export type QuestionMultipleProps = {
  question: MultipleQuestion;
  response: Response[];
} & WithQuestionCallback &
  MultiSelectProps;

export const createMultipleResponse = (
  question: MultipleQuestion,
  text = "",
): Response => {
  const response = Response.fromQuestion(question);
  response.text = text;
  return response;
};

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
      res.flag = "u";
      return res;
    });

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
