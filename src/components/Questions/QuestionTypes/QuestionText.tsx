import { TextInput, TextInputProps } from "@mantine/core";
import { BaseQuestionProps } from "../Question";

type QuestionTextProps = BaseQuestionProps & TextInputProps;

export default function QuestionText({
  question,
  ...props
}: QuestionTextProps) {
  return (
    <TextInput placeholder="Text" value={question.answer.value} {...props} />
  );
}
