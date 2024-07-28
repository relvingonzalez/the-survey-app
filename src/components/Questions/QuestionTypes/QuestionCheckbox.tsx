import { Checkbox, CheckboxProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import { CheckboxQuestion } from "@/lib/types/question";
import Response from "@/lib/dexie/Response";

export type QuestionCheckboxProps = {
  question: CheckboxQuestion;
  response: Response[];
} & WithQuestionCallback &
  CheckboxProps;

export const createCheckboxResponse = (
  question: CheckboxQuestion,
  label: string,
): Response => {
  const response = Response.fromQuestion(question);
  response.label = label;
  response.checked = false;
  return response;
};

export default function QuestionCheckbox({
  question,
  response,
  onAnswered,
  ...props
}: QuestionCheckboxProps) {
  const checkedOption = (optionResponse: Response, checked: boolean) => {
    optionResponse.checked = checked;
    onAnswered(optionResponse);
  };
  Checkbox;
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
