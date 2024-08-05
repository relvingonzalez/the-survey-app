import { Checkbox, CheckboxProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import { Question, Response } from "../../../../internal";

export type QuestionCheckboxProps = {
  question: Question;
  response: Response[];
} & WithQuestionCallback &
  CheckboxProps;

export const createCheckboxResponse = (
  { projectId, id: questionId, responseType }: Question,
  label: string,
) => {
  return Response.create({
    projectId,
    questionId,
    responseType,
    label,
    checked: false,
  });
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

  return (
    <>
      {question.options.map((option, i) => {
        const optionResponse =
          response.find((r) => r.label === option) ??
          createCheckboxResponse(question, option);
        return (
          <Checkbox
            {...props}
            label={option}
            key={i}
            mt="10"
            checked={optionResponse?.checked}
            onChange={(e) => {
              optionResponse &&
                checkedOption(optionResponse, e.currentTarget.checked);
            }}
          />
        );
      })}
    </>
  );
}
