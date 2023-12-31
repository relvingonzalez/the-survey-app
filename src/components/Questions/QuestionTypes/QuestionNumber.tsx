import { NumberQuestion } from "@/lib/types/question";
import { TextInput, TextInputProps } from "@mantine/core";

export type QuestionNumberProps = {
  question: NumberQuestion;
} & TextInputProps;

export default function QuestionNumber({
  question,
  ...props
}: QuestionNumberProps) {
  return (
    <TextInput
      {...props}
      value={question.answer.value}
      type="number"
      label="Number"
      min="0"
      onKeyDown={(event) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }}
    />
  );
}
