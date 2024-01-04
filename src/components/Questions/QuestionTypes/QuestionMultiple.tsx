import { MultipleQuestion } from "@/lib/types/question";
import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { WithQuestionCallback } from "../Question";

export type QuestionMultipleProps = {
  question: MultipleQuestion;
} & WithQuestionCallback<MultipleQuestion["answer"]["value"]> &
  MultiSelectProps;

export default function QuestionListSelect({
  question,
  onAnswered,
  ...props
}: QuestionMultipleProps) {
  return (
    <MultiSelect
      {...props}
      name="list"
      label="Select"
      placeholder="--Select One or Many--"
      data={question.listOptions}
      defaultValue={question.answer.value}
      onChange={onAnswered}
    />
  );
}
