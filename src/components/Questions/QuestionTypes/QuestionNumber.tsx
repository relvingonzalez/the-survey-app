import { NumberInput, NumberInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import {
  NumberQuestion,
  NumberResponse,
  QuestionResponse,
} from "@/lib/types/question_new";

export type QuestionNumberProps = {
  question: NumberQuestion;
  response: NumberResponse[];
} & WithQuestionCallback<NumberResponse> &
  NumberInputProps;

export function isNumberResponse(
  response: QuestionResponse[],
): response is NumberResponse[] {
  return (
    (response as NumberResponse[])[0]?.responseType === "number" ||
    !response.length
  );
}

export const createNumberResponse = (
  { projectId, id: questionId, responseType }: NumberQuestion,
  number?: number,
): NumberResponse => ({
  projectId,
  questionId,
  responseType,
  number,
});

export default function QuestionNumber({
  question,
  response,
  onAnswered,
  ...props
}: QuestionNumberProps) {
  const responseValue = response[0] || createNumberResponse(question);
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
