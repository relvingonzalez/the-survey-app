import { TextInput, TextInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import { useEffect, useState } from "react";
import { Question, Response } from "../../../../internal";

export type QuestionEmailProps = {
  question: Question;
  response: Response[];
} & WithQuestionCallback &
  TextInputProps;

export const emailPattern =
  '[a-z0-9!#$%&"*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&"*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';

export const emailPatternRegex = new RegExp(
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
);

export const createEmailResponse = (
  { projectId, id: questionId, responseType }: Question,
  email: string = "",
) => Response.create({ projectId, questionId, responseType, email });

export default function QuestionEmail({
  response,
  onAnswered,
  ...props
}: QuestionEmailProps) {
  const responseValue = response[0];
  const [value, setValue] = useState(responseValue?.email);
  const handleOnChange = (newValue: string) => {
    setValue(newValue);
    responseValue.email = value;
    onAnswered(responseValue);
  };
  useEffect(() => {
    if (!value && responseValue) {
      setValue(responseValue.email);
    }
  }, [responseValue, value]);
  return (
    <TextInput
      {...props}
      value={value}
      label="Email"
      type="email"
      placeholder="email@example.com"
      pattern={emailPattern}
      onChange={(e) => {
        handleOnChange(e.target.value);
      }}
    />
  );
}
