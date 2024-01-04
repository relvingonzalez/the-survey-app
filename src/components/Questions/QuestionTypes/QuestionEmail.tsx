import { EmailQuestion } from "@/lib/types/question";
import { TextInput, TextInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../Question";

export type QuestionEmailProps = {
  question: EmailQuestion;
} & WithQuestionCallback<EmailQuestion["answer"]["value"]> &
  TextInputProps;

export const emailPattern =
  '[a-z0-9!#$%&"*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&"*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';

export const emailPatternRegex = new RegExp(emailPattern);

export default function QuestionEmail({
  question,
  onAnswered,
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
      onChange={(e) => {
        onAnswered(e.target.value);
      }}
    />
  );
}
