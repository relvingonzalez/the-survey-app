import { TextInput, TextInputProps } from "@mantine/core";
import { TextQuestion, ValueByQuestionType } from "@/lib/types/question";
import { WithQuestionCallback } from "../SurveyItem";

export type QuestionTextProps = {
  question: TextQuestion;
} & WithQuestionCallback<ValueByQuestionType<TextQuestion>> &
  TextInputProps;

export declare function isTextQuestion(
  param: unknown,
): asserts param is TextQuestion;

export default function QuestionText({
  question,
  onAnswered,
  ...props
}: QuestionTextProps) {
  const value = question.answer.value || "";
  return (
    <TextInput
      placeholder="Text"
      value={value}
      onChange={(e) => {
        onAnswered(e.target.value);
      }}
      {...props}
    />
  );
}
