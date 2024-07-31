import { DateTimePicker, DateTimePickerProps } from "@mantine/dates";
import { WithQuestionCallback } from "../SurveyItem";
import { DateTimeQuestion } from "@/lib/types/question";
import Response from "@/lib/dexie/Response";

export type QuestionDateTimeProps = {
  question: DateTimeQuestion;
  response: Response[];
} & WithQuestionCallback &
  DateTimePickerProps;

export default function QuestionDateTime({
  response,
  onAnswered,
  ...props
}: QuestionDateTimeProps) {
  const responseValue = response[0];
  const handleChange = (date: Date) => {
    responseValue.date = date;
    onAnswered(responseValue);
  };

  return (
    <DateTimePicker
      {...props}
      clearable
      defaultValue={responseValue.date}
      valueFormat="YYYY-MMM-DD HH:mm"
      label="Pick date and time"
      onDateChange={handleChange}
    />
  );
}
