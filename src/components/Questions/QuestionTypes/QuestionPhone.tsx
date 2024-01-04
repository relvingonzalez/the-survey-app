import { PhoneQuestion, ValueByQuestionType } from "@/lib/types/question";
import { TextInput, TextInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../Question";

export type QuestionPhoneProps = {
  question: PhoneQuestion;
} & WithQuestionCallback<ValueByQuestionType<PhoneQuestion>> &
  TextInputProps;

export const phonePattern = '^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$';
export const phonePatternRegex = new RegExp(phonePattern);

export default function QuestionPhone({
  question,
  onAnswered,
  ...props
}: QuestionPhoneProps) {
  return (
    <TextInput
      {...props}
      value={question.answer.value}
      type="tel"
      label="Telephone"
      placeholder="+9-(999)999-9999"
      pattern={phonePattern}
      onChange={(e) => {
        onAnswered(e.target.value);
      }}
    />
  );
}
