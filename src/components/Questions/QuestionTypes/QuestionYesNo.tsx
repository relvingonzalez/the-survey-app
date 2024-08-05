import { Radio, RadioProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import { ChangeEvent } from "react";
import { Question, Response } from "../../../../internal";

export type QuestionYesNoProps = {
  question: Question;
  response: Response[];
} & WithQuestionCallback &
  RadioProps;

const options = [
  { label: "Yes", value: true },
  { label: "No", value: false },
  { label: "Unknown", value: null },
];

export default function QuestionYesNo({
  response,
  onAnswered,
  ...props
}: QuestionYesNoProps) {
  const responseValue = response[0];
  const handleOnChange = (
    event: ChangeEvent<HTMLInputElement>,
    value: boolean | null,
  ) => {
    if (event.currentTarget.checked) {
      responseValue.yesNo = value;
      onAnswered(responseValue);
    }
  };

  return (
    <>
      {options.map((option, i) => {
        return (
          <Radio
            {...props}
            mt="sm"
            key={i}
            label={option.label}
            checked={option.value === responseValue.yesNo}
            onChange={(e) => handleOnChange(e, option.value)}
          />
        );
      })}
    </>
  );
}
