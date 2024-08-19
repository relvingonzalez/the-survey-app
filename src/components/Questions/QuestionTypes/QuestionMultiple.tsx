import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { WithQuestionCallbacks } from "../SurveyItem";
import { Question, Response } from "../../../../internal";

export type QuestionMultipleProps = {
  question: Question;
  response: Response[];
} & WithQuestionCallbacks &
  MultiSelectProps;

export const createMultipleResponse = (
  { projectId, id: questionId, responseType }: Question,
  text = "",
) => Response.create({ projectId, questionId, responseType, text });

export default function QuestionListSelect({
  question,
  response,
  onAnswered,
  onDeleted,
  ...props
}: QuestionMultipleProps) {
  const handleOnChange = async (selection: string[]) => {
    if (selection.length >= response.length) {
      const result = selection.map((s) => {
        const res =
          response.find((r) => r.text === s) ||
          createMultipleResponse(question, s);
        return res;
      });
      onAnswered(result);
    } else {
      // Check which ones to remove and add flag
      const selectionsToRemove = question.options.filter(
        (o) => !selection.includes(o),
      );
      const responsesToRemove = response.filter(
        (r) => r.text && selectionsToRemove.includes(r.text),
      );
      onDeleted(responsesToRemove);
    }
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
        .map((r) => r.text ?? "")}
      onChange={handleOnChange}
    />
  );
}
