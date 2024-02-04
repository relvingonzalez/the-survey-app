import { Radio, RadioProps } from "@mantine/core";
import {
  ValueByQuestionType,
  YesNo,
  YesNoQuestion,
} from "@/lib/types/question";
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
  const options: YesNo[] = ["Yes", "No", "Unknown"];
  const value = question.answer.value || "";
  return (
    <>
      {options.map((option, i) => {
        return (
          <Radio
            {...props}
            mt="sm"
            key={i}
            label={option}
            checked={option.toLowerCase() === value.toLowerCase()}
            onChange={(event) =>
              event.currentTarget.checked ? onAnswered(option) : null
            }
          />
        );
      })}
    </>
  );
}
