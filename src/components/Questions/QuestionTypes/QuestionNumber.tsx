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

export default function QuestionNumber({
  response,
  onAnswered,
  ...props
}: QuestionNumberProps) {
  const responseValue = response[0];
  const [value, setValue] = useState<string | number | undefined>(
    responseValue.number,
  );
  const handleOnChange = (value: string | number) => {
    setValue(value);
    responseValue.number = Number(value);
    onAnswered(responseValue);
  };
  useEffect(() => {
    if (!value && responseValue) {
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
