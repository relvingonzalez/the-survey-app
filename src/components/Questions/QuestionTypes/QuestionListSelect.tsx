import { Select, SelectProps } from "@mantine/core";
import { ListQuestion, ValueByQuestionType } from "@/lib/types/question";
import { WithQuestionCallback } from "../Question";

export type QuestionListSelectProps = {
  question: ListQuestion;
} & WithQuestionCallback<ValueByQuestionType<ListQuestion>> &
  SelectProps;

export default function QuestionListSelect({
  question,
  onAnswered,
  ...props
}: QuestionListSelectProps) {
  return (
    <Select
      {...props}
      name="list"
      label="Select"
      placeholder="--Select One--"
      data={question.listOptions}
      onChange={onAnswered}
    />
  );
}
