import { TextInput, TextInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import {
  EmailQuestion,
  EmailResponse,
  QuestionResponse,
} from "@/lib/types/question_new";
import { useEffect, useState } from "react";

export type QuestionEmailProps = {
  question: EmailQuestion;
  response: EmailResponse[];
} & WithQuestionCallback<EmailResponse> &
  TextInputProps;

export const emailPattern =
  '[a-z0-9!#$%&"*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&"*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';

export const emailPatternRegex = new RegExp(
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
);

export function isEmailResponse(
  response: QuestionResponse[],
): response is EmailResponse[] {
  return (
    (response as EmailResponse[])[0]?.responseType === "email" ||
    !response.length
  );
}

export const createEmailResponse = (
  { projectId, id: questionId, responseType }: EmailQuestion,
  email: string = "",
): EmailResponse => ({
  projectId,
  questionId,
  responseType,
  email,
});

export default function QuestionEmail({
  question,
  response,
  onAnswered,
  ...props
}: QuestionEmailProps) {
  const responseValue = response[0] || createEmailResponse(question);
  const [value, setValue] = useState(responseValue.email);
  const handleOnChange = (newValue: string) => {
    setValue(newValue)
    onAnswered({ ...responseValue, email: newValue });
  };
  useEffect(() => {
    if(!value) {
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
