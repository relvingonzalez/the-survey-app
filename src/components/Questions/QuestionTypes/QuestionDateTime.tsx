import { DateTimeQuestion } from "@/lib/types/question";
import { DateTimePicker, DateTimePickerProps } from "@mantine/dates";
import { WithQuestionCallback } from "../Question";

export type QuestionDateTimeProps = {
  question: DateTimeQuestion;
} & WithQuestionCallback<DateTimeQuestion["answer"]["value"]> &
  DateTimePickerProps;

export default function QuestionDateTime({
  question,
  onAnswered,
  ...props
}: QuestionDateTimeProps) {
  //question.answer[option]
  return (
    <DateTimePicker
      {...props}
      clearable
      defaultValue={question.answer.value}
      valueFormat="YYYY-MMM-DD HH:mm"
      label="Pick date and time"
      onDateChange={(date: Date) => onAnswered(date)}
    />
  );
}
