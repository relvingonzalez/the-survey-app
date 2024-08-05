import { NumberInput, NumberInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import { useEffect, useState } from "react";
import { Question, Response } from "../../../../internal";

export type QuestionNumberProps = {
  question: Question;
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
