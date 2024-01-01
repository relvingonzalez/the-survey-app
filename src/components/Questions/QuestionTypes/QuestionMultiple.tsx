import { MultipleQuestion } from "@/lib/types/question";
import { MultiSelect, MultiSelectProps } from "@mantine/core";

export type QuestionMultipleProps = {
  question: MultipleQuestion;
} & MultiSelectProps;

export default function QuestionListSelect({
  question,
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
    />
  );
}
