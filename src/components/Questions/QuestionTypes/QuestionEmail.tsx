import { EmailQuestion, ValueByQuestionType } from "@/lib/types/question";
import { TextInput, TextInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../Question";

export type QuestionEmailProps = {
  question: EmailQuestion;
} & WithQuestionCallback<ValueByQuestionType<EmailQuestion>> &
  TextInputProps;

export const emailPattern =
  '[a-z0-9!#$%&"*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&"*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';

export const emailPatternRegex = new RegExp(
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
);

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
