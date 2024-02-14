import { DateTimePicker, DateTimePickerProps } from "@mantine/dates";
import { WithQuestionCallback } from "../SurveyItem";
import {
  DateTimeQuestion,
  DateTimeResponse,
  QuestionResponse,
} from "@/lib/types/question_new";

export type QuestionDateTimeProps = {
  question: DateTimeQuestion;
  response: DateTimeResponse[];
} & WithQuestionCallback<DateTimeResponse> &
  DateTimePickerProps;

export function isDateTimeResponse(
  response: QuestionResponse[],
): response is DateTimeResponse[] {
  return (
    (response as DateTimeResponse[])[0]?.responseType === "datetime" ||
    !response.length
  );
}

export const createDateTimeResponse = (
  { projectId, id: questionId, responseType }: DateTimeQuestion,
  date = null,
): DateTimeResponse => ({
  projectId,
  questionId,
  responseType,
  date,
});

export default function QuestionDateTime({
  question,
  response,
  onAnswered,
  ...props
}: QuestionDateTimeProps) {
  const responseValue = response[0] || createDateTimeResponse(question);
  return (
    <DateTimePicker
      {...props}
      clearable
      defaultValue={responseValue.date}
      valueFormat="YYYY-MMM-DD HH:mm"
      label="Pick date and time"
      onDateChange={(date: Date) => onAnswered({ ...responseValue, date })}
    />
  );
}
