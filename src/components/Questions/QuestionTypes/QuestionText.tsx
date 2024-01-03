import { TextInput, TextInputProps } from "@mantine/core";
import { TextQuestion } from "@/lib/types/question";
import { WithQuestionCallback } from "../Question";

export type QuestionTextProps = {
  question: TextQuestion;
} & WithQuestionCallback<TextQuestion> &
  TextInputProps;

export declare function isTextQuestion(
  param: unknown,
): asserts param is TextQuestion;

export default function QuestionText({
  question,
  onAnswered,
  ...props
}: QuestionTextProps) {
  return (
    <TextInput
      placeholder="Text"
      value={question.answer.value}
      onChange={(e) => {
        onAnswered(e.target.value);
      }}
      {...props}
    />
  );
}
