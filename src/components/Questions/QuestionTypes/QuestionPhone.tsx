import { PhoneQuestion } from "@/lib/types/question";
import { TextInput, TextInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../Question";

export type QuestionPhoneProps = {
  question: PhoneQuestion;
} & WithQuestionCallback<PhoneQuestion["answer"]["value"]> &
  TextInputProps;

export const phonePattern = "^[0-9+()-]*$";
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
