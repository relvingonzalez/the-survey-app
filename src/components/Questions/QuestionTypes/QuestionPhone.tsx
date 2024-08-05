import { TextInput, TextInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import { useEffect, useState } from "react";
import { Question, Response } from "../../../../internal";

export type QuestionPhoneProps = {
  question: Question;
  response: Response[];
} & WithQuestionCallback &
  TextInputProps;

export const phonePattern =
  "^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$";
export const phonePatternRegex = new RegExp(phonePattern);

export default function QuestionPhone({
  response,
  onAnswered,
  ...props
}: QuestionPhoneProps) {
  const responseValue = response[0];
  const [value, setValue] = useState(responseValue.phone);
  const handleOnChange = (value: string) => {
    setValue(value);
    responseValue.phone = value;
    onAnswered(responseValue);
  };
  useEffect(() => {
    if (!value && responseValue) {
      setValue(responseValue.phone);
    }
  }, [responseValue, value]);

  return (
    <TextInput
      {...props}
      value={value}
      type="tel"
      label="Telephone"
      placeholder="+9-(999)999-9999"
      pattern={phonePattern}
      onChange={(e) => {
        handleOnChange(e.target.value);
      }}
    />
  );
}
