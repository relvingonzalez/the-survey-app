import { DateTimeQuestion, ValueByQuestionType } from "@/lib/types/question";
import { DateTimePicker, DateTimePickerProps } from "@mantine/dates";
import { WithQuestionCallback } from "../SurveyItem";

export type QuestionDateTimeProps = {
  question: DateTimeQuestion;
} & WithQuestionCallback<ValueByQuestionType<DateTimeQuestion>> &
  DateTimePickerProps;

export default function QuestionDateTime({
  question,
  onAnswered,
  ...props
}: QuestionDateTimeProps) {
  //question.answer[option]
  const value = question.answer.value || undefined;
  return (
    <DateTimePicker
      {...props}
      clearable
      defaultValue={value}
      valueFormat="YYYY-MMM-DD HH:mm"
      label="Pick date and time"
      onDateChange={(date: Date) => onAnswered(date)}
    />
  );
}
