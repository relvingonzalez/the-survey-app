import { TextInput, TextInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import { useState } from "react";
import { Question, Response } from "../../../../internal";

export type QuestionTextProps = {
  question: Question;
  response: Response[];
} & WithQuestionCallback &
  TextInputProps;

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
