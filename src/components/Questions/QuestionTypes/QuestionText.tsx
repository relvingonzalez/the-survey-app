import { TextInput, TextInputProps } from "@mantine/core";
import { TextQuestion } from "@/lib/types/question";

export type QuestionTextProps = {
  question: TextQuestion;
} & TextInputProps;

export default function QuestionText({
  question,
  ...props
}: QuestionTextProps) {
  return (
    <TextInput placeholder="Text" value={question.answer.value} {...props} />
  );
}
