import { CheckboxQuestion, ValueByQuestionType } from "@/lib/types/question";
import { Checkbox, CheckboxProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";

export type QuestionCheckboxProps = {
  question: CheckboxQuestion;
} & WithQuestionCallback<ValueByQuestionType<CheckboxQuestion>> &
  CheckboxProps;

export default function QuestionCheckbox({
  question,
  onAnswered,
  ...props
}: QuestionCheckboxProps) {
  const value =
    question.answer.value ||
    Object.fromEntries(question.listOptions.map((x) => [x, false]));
  // Make a copy, change the checked option, and submit the changes
  const checkedOption = (option: string, checked: boolean) => {
    const newValue = structuredClone(value);
    newValue[option] = checked;
    onAnswered(newValue);
  };

  return (
    <>
      {question.listOptions.map((option, i) => {
        return (
          <Checkbox
            {...props}
            label={option}
            key={i}
            mt="10"
            checked={!!value[option]}
            onChange={(e) => {
              checkedOption(option, e.currentTarget.checked);
            }}
          />
        );
      })}
    </>
  );
}
