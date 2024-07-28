import { TextInput, TextInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import { EmailQuestion } from "@/lib/types/question";
import { useEffect, useState } from "react";
import Response from "@/lib/dexie/Response";

export type QuestionEmailProps = {
  question: EmailQuestion;
  response: Response[];
} & WithQuestionCallback &
  TextInputProps;

export const emailPattern =
  '[a-z0-9!#$%&"*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&"*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';

export const emailPatternRegex = new RegExp(
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
);

export const createEmailResponse = (
  question: EmailQuestion,
  email: string = "",
): Response => {
  const response = Response.fromQuestion(question);
  response.email = email;
  return response;
};

export default function QuestionEmail({
  question,
  response,
  onAnswered,
  ...props
}: QuestionEmailProps) {
  const responseValue = response[0] || createEmailResponse(question);
  const [value, setValue] = useState(responseValue.email);
  const handleOnChange = (newValue: string) => {
    setValue(newValue);
    responseValue.email = value;
    onAnswered(responseValue);
  };
  useEffect(() => {
    if (!value) {
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
