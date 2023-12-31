import { PhoneQuestion } from "@/lib/types/question";
import { TextInput, TextInputProps } from "@mantine/core";

export type QuestionPhoneProps = {
  question: PhoneQuestion;
} & TextInputProps;

export default function QuestionPhone({
  question,
  ...props
}: QuestionPhoneProps) {
  return (
    <TextInput
      {...props}
      value={question.answer.value}
      type="tel"
      label="Telephone"
      placeholder="+9-(999)999-9999"
      pattern="^[0-9+()-]*$"
    />
  );
}
