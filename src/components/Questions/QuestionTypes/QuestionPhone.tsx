import { TextInput, TextInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import {
  PhoneQuestion,
  PhoneResponse,
  QuestionResponse,
} from "@/lib/types/question";
import { useEffect, useState } from "react";
import Response from "@/lib/dexie/Response";

export type QuestionPhoneProps = {
  question: PhoneQuestion;
  response: Response[];
} & WithQuestionCallback &
  TextInputProps;

export const phonePattern =
  "^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$";
export const phonePatternRegex = new RegExp(phonePattern);

export function isPhoneResponse(
  response: QuestionResponse[],
): response is PhoneResponse[] {
  return (
    (response as PhoneResponse[])[0]?.responseType === "phone" ||
    !response.length
  );
}

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
