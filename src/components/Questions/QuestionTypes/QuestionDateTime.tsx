import { DateTimePicker, DateTimePickerProps } from "@mantine/dates";
import { WithQuestionCallback } from "../SurveyItem";
import { DateTimeResponse, QuestionResponse } from "@/lib/types/question_new";

export type QuestionDateTimeProps = {
  response: DateTimeResponse[];
} & WithQuestionCallback<DateTimeResponse> &
  DateTimePickerProps;

export function isDateTimeResponse(
  response: QuestionResponse[],
): response is DateTimeResponse[] {
  return (response as DateTimeResponse[])[0]?.responseType === "datetime";
}

export default function QuestionDateTime({
  response,
  onAnswered,
  ...props
}: QuestionDateTimeProps) {
  const responseValue = response[0];
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
