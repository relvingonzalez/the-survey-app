import { CheckboxQuestion } from "@/lib/types/question";
import { Checkbox, CheckboxProps } from "@mantine/core";

export type QuestionCheckboxProps = {
  question: CheckboxQuestion;
} & CheckboxProps;

export default function QuestionCheckbox({
  question,
  ...props
}: QuestionCheckboxProps) {
  //question.answer[option]
  return (
    <>
      {question.listOptions.map((option, i) => {
        return (
          <Checkbox
            {...props}
            label={option}
            key={i}
            mt="10"
            checked={question.answer.value[option]}
          />
        );
      })}
    </>
  );
}
