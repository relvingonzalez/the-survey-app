import { Radio, RadioProps } from "@mantine/core";
import {
  ValueByQuestionType,
  YesNo,
  YesNoQuestion,
} from "@/lib/types/question";
import { WithQuestionCallback } from "../Question";

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
  return (
    <>
      {options.map((option, i) => {
        return (
          <Radio
            {...props}
            mt="sm"
            key={i}
            label={option}
            checked={option === question.answer.value}
            onChange={(event) =>
              event.currentTarget.checked ? onAnswered(option) : null
            }
          />
        );
      })}
    </>
  );
}
