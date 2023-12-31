import { Select, SelectProps } from "@mantine/core";
import { ListQuestion } from "@/lib/types/question";

export type QuestionListSelectProps = {
  question: ListQuestion;
} & SelectProps;

export default function QuestionListSelect({
  question,
  ...props
}: QuestionListSelectProps) {
  return (
    <Select
      {...props}
      name="list"
      label="Select"
      placeholder="--Select One--"
      data={question.listOptions}
    />
  );
}
