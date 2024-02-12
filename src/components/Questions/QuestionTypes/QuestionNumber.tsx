import { NumberInput, NumberInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import { NumberResponse, QuestionResponse } from "@/lib/types/question_new";

export type QuestionNumberProps = {
  response: NumberResponse[];
} & WithQuestionCallback<NumberResponse> &
  NumberInputProps;

export function isNumberResponse(
  response: QuestionResponse[],
): response is NumberResponse[] {
  return (response as NumberResponse[])[0]?.responseType === "number";
}

export default function QuestionNumber({
  response,
  onAnswered,
  ...props
}: QuestionNumberProps) {
  const responseValue = response[0];
  const handleOnChange = (value: string | number) => {
    onAnswered({ ...responseValue, number: Number(value) });
  };
  return (
    <NumberInput
      {...props}
      value={responseValue.number}
      label="Number"
      min={0}
      onChange={handleOnChange}
    />
  );
}
