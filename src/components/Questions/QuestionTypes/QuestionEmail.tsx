import { EmailQuestion } from "@/lib/types/question";
import { TextInput, TextInputProps } from "@mantine/core";

export type QuestionEmailProps = {
  question: EmailQuestion;
} & TextInputProps;

export default function QuestionEmail({
  question,
  ...props
}: QuestionEmailProps) {
  const pattern =
    '[a-z0-9!#$%&"*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&"*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';
  return (
    <TextInput
      {...props}
      value={question.answer.value}
      label="Email"
      type="email"
      placeholder="email@example.com"
      pattern={pattern}
    />
  );
}
