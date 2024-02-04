import { MultipleQuestion, ValueByQuestionType } from "@/lib/types/question";
import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";

export type QuestionMultipleProps = {
  question: MultipleQuestion;
} & WithQuestionCallback<ValueByQuestionType<MultipleQuestion>> &
  MultiSelectProps;

export default function QuestionListSelect({
  question,
  onAnswered,
  ...props
}: QuestionMultipleProps) {
  const value = (question.answer.value && question.answer.value) || [];
  console.log(value, typeof value);
  return (
    <MultiSelect
      {...props}
      name="list"
      label="Select"
      placeholder="--Select One or Many--"
      data={question.listOptions}
      defaultValue={value}
      onChange={onAnswered}
    />
  );
}
