import { Select, SelectProps } from "@mantine/core";
import { ListQuestion, ValueByQuestionType } from "@/lib/types/question";
import { WithQuestionCallback } from "../SurveyItem";

export type QuestionListSelectProps = {
  question: ListQuestion;
} & WithQuestionCallback<ValueByQuestionType<ListQuestion>> &
  SelectProps;

export default function QuestionListSelect({
  question,
  onAnswered,
  ...props
}: QuestionListSelectProps) {
  const value = question.answer.value || "";
  return (
    <Select
      {...props}
      name="list"
      label="Select"
      value={value}
      placeholder="--Select One--"
      data={question.listOptions}
      onChange={onAnswered}
    />
  );
}
