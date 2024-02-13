import { Select, SelectProps } from "@mantine/core";
import {
  ListQuestion,
  ListResponse,
  QuestionResponse,
} from "@/lib/types/question_new";
import { WithQuestionCallback } from "../SurveyItem";

export type QuestionListSelectProps = {
  question: ListQuestion;
  response: ListResponse[];
} & WithQuestionCallback<ListResponse> &
  SelectProps;

export function isListResponse(
  response: QuestionResponse[],
): response is ListResponse[] {
  return (response as ListResponse[])[0]?.responseType === "list";
}

export const createListResponse = (
  { projectId, id: questionId, responseType }: ListQuestion,
  text = "",
): ListResponse => ({
  projectId,
  questionId,
  responseType,
  text,
});

export default function QuestionListSelect({
  question,
  response,
  onAnswered,
  ...props
}: QuestionListSelectProps) {
  const responseValue = response[0];
  const handleOnChange = (value: string | null) => {
    onAnswered({ ...responseValue, text: value });
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
