import { NumberQuestion, ValueByQuestionType } from "@/lib/types/question";
import { TextInput, TextInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../Question";

export type QuestionNumberProps = {
  question: NumberQuestion;
} & WithQuestionCallback<ValueByQuestionType<NumberQuestion>> &
  TextInputProps;

export default function QuestionNumber({
  question,
  onAnswered,
  ...props
}: QuestionNumberProps) {
  return (
    <TextInput
      {...props}
      value={question.answer.value}
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
