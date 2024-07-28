import { Radio, RadioProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import { YesNoQuestion } from "@/lib/types/question";
import Response from "@/lib/dexie/Response";
import { ChangeEvent } from "react";

export type QuestionYesNoProps = {
  question: YesNoQuestion;
  response: Response[];
} & WithQuestionCallback &
  RadioProps;

export const createYesNoResponse = (
  question: YesNoQuestion,
  yesNo = null,
): Response => {
  const response = Response.fromQuestion(question);
  response.yesNo = yesNo;
  return response;
};

const options = [
  { label: "Yes", value: true },
  { label: "No", value: false },
  { label: "Unknown", value: null },
];

export default function QuestionYesNo({
  question,
  response,
  onAnswered,
  ...props
}: QuestionYesNoProps) {
  const responseValue = response[0] || createYesNoResponse(question);
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
