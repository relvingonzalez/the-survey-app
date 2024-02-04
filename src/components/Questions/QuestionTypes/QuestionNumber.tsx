import { NumberQuestion, ValueByQuestionType } from "@/lib/types/question";
import { TextInput, TextInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";

export type QuestionNumberProps = {
  question: NumberQuestion;
} & WithQuestionCallback<ValueByQuestionType<NumberQuestion>> &
  TextInputProps;

export default function QuestionNumber({
  question,
  onAnswered,
  ...props
}: QuestionNumberProps) {
  const value = question.answer.value || "";
  return (
    <TextInput
      {...props}
      value={value}
      type="number"
      label="Number"
      min="0"
      onKeyDown={(event) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }}
      onChange={(e) => {
        onAnswered(e.target.value);
      }}
    />
  );
}
