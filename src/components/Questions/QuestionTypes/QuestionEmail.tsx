import { EmailQuestion } from "@/lib/types/question";
import { TextInput, TextInputProps } from "@mantine/core";

export type QuestionEmailProps = {
  question: EmailQuestion;
} & TextInputProps;

export const emailPattern =
  '[a-z0-9!#$%&"*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&"*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';

export default function QuestionEmail({
  question,
  ...props
}: QuestionEmailProps) {
  return (
    <TextInput
      {...props}
      value={question.answer.value}
      label="Email"
      type="email"
      placeholder="email@example.com"
      pattern={emailPattern}
    />
  );
}
