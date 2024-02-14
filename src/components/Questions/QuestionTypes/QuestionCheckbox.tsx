import { Checkbox, CheckboxProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import {
  CheckboxQuestion,
  CheckboxResponse,
  QuestionResponse,
} from "@/lib/types/question_new";

export type QuestionCheckboxProps = {
  question: CheckboxQuestion;
  response: CheckboxResponse[];
} & WithQuestionCallback<CheckboxResponse> &
  CheckboxProps;

export function isCheckboxResponse(
  response: QuestionResponse[],
): response is CheckboxResponse[] {
  return (
    (response as CheckboxResponse[])[0]?.responseType === "checkbox" ||
    !response.length
  );
}

export const createCheckboxResponse = (
  { projectId, id: questionId, responseType }: CheckboxQuestion,
  label: string,
): CheckboxResponse => ({
  projectId,
  questionId,
  responseType,
  label,
  checked: false,
});

export default function QuestionCheckbox({
  question,
  response,
  onAnswered,
  ...props
}: QuestionCheckboxProps) {
  const checkedOption = (
    optionResponse: CheckboxResponse,
    checked: boolean,
  ) => {
    onAnswered({ ...optionResponse, checked });
  };

  return (
    <>
      {question.options.map((option, i) => {
        const optionResponse =
          response.find((r) => r.label === option) ||
          createCheckboxResponse(question, option);
        return (
          <Checkbox
            {...props}
            label={option}
            key={i}
            mt="10"
            checked={optionResponse.checked}
            onChange={(e) => {
              checkedOption(optionResponse, e.currentTarget.checked);
            }}
          />
        );
      })}
    </>
  );
}
