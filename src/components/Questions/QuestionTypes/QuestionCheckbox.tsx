import { Checkbox } from "@mantine/core";
import { QuestionTypeProps } from "../QuestionType";

export default function QuestionCheckbox({
  question,
  onChange,
}: QuestionTypeProps) {
  //question.answer[option]
  return (
    <>
      {question.type === "checkbox" &&
        question.listOptions.map((option, i) => {
          return (
            <Checkbox label={option} key={i} mt="10" onChange={onChange} />
          );
        })}
    </>
  );
}
