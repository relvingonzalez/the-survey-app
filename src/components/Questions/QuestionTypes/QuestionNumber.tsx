import { NumberInput, NumberInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import { NumberQuestion } from "@/lib/types/question";
import { useEffect, useState } from "react";
import Response from "@/lib/dexie/Response";

export type QuestionNumberProps = {
  question: NumberQuestion;
  response: Response[];
} & WithQuestionCallback &
  NumberInputProps;

export const createNumberResponse = (
  question: NumberQuestion,
  number: number = 0,
): Response => {
  const response = Response.fromQuestion(question);
  response.number = number;
  return response;
};

export default function QuestionNumber({
  question,
  response,
  onAnswered,
  ...props
}: QuestionNumberProps) {
  const responseValue = response[0] || createNumberResponse(question);
  const [value, setValue] = useState<string | number | undefined>(
    responseValue.number,
  );
  const handleOnChange = (value: string | number) => {
    setValue(value);
    responseValue.number = Number(value);
    onAnswered(responseValue);
  };
  useEffect(() => {
    if (!value) {
      setValue(responseValue.number);
    }
  }, [responseValue, value]);
  return (
    <NumberInput
      {...props}
      value={value}
      label="Number"
      min={0}
      onChange={handleOnChange}
    />
  );
}
