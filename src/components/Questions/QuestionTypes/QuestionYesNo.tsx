import { Radio, RadioProps } from "@mantine/core";
import { ValueByQuestionType, YesNoQuestion } from "@/lib/types/question";
import { WithQuestionCallback } from "../SurveyItem";

export type QuestionYesNoProps = {
  question: YesNoQuestion;
} & WithQuestionCallback<ValueByQuestionType<YesNoQuestion>> &
  RadioProps;

export default function QuestionYesNo({
  question,
  onAnswered,
  ...props
}: QuestionYesNoProps) {
  const options = [
    { label: "Yes", value: true },
    { label: "No", value: false },
    { label: "Unknown", value: null },
  ];
  const value = question.answer.value || "";
  return (
    <>
      {options.map((option, i) => {
        return (
          <Radio
            {...props}
            mt="sm"
            key={i}
            label={option.label}
            checked={option.value === value}
            onChange={(event) =>
              event.currentTarget.checked ? onAnswered(option.value) : null
            }
          />
        );
      })}
    </>
  );
}
