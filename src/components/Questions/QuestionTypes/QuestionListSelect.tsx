import { Select, SelectProps } from "@mantine/core";
import { ListQuestion } from "@/lib/types/question";
import { WithQuestionCallback } from "../SurveyItem";
import Response from "@/lib/dexie/Response";

export type QuestionListSelectProps = {
  question: ListQuestion;
  response: Response[];
} & WithQuestionCallback &
  SelectProps;

export default function QuestionListSelect({
  question,
  response,
  onAnswered,
  ...props
}: QuestionListSelectProps) {
  const responseValue = response[0];
  const handleOnChange = (value: string | null) => {
    responseValue.text = value;
    onAnswered(responseValue);
  };
  return (
    <Select
      {...props}
      name="list"
      label="Select"
      value={responseValue.text}
      placeholder="--Select One--"
      data={question.options}
      onChange={handleOnChange}
    />
  );
}
