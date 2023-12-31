import { TextInput, TextInputProps } from "@mantine/core";
import { YesNoQuestion } from "@/lib/types/question";

export type QuestionYesNoProps = {
  question: YesNoQuestion;
} & TextInputProps;

export default function QuestionYesNo({
  question,
  ...props
}: QuestionYesNoProps) {
  //question.answer[option]
  const options = ["Yes", "No", "Unknown"];
  return (
    <>
      {options.map((option, i) => {
        return (
          <TextInput
            {...props}
            value={question.answer.value}
            type="radio"
            label={option}
            min="0"
            key={i}
            name="radio"
            checked={option === question.answer.value}
          />
        );
      })}
    </>
  );
}
