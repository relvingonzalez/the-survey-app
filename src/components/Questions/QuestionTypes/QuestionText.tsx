import { TextInput, TextInputProps } from "@mantine/core";
import { TextQuestion } from "@/lib/types/question";
import { WithQuestionCallback } from "../SurveyItem";
import { useState } from "react";
import Response from "@/lib/dexie/Response";

export type QuestionTextProps = {
  question: TextQuestion;
  response: Response[];
} & WithQuestionCallback &
  TextInputProps;

export declare function isTextQuestion(
  param: unknown,
): asserts param is TextQuestion;

export default function QuestionText({
  response,
  onAnswered,
  ...props
}: QuestionTextProps) {
  const responseValue = response[0];
  const [value, setValue] = useState(responseValue.text ?? "");

  const handleOnChange = (value: string) => {
    setValue(value);
    responseValue.text = value;
    onAnswered(responseValue);
  };

  return (
    <TextInput
      placeholder="Text"
      value={value}
      onChange={(e) => {
        handleOnChange(e.target.value);
      }}
      {...props}
    />
  );
}
