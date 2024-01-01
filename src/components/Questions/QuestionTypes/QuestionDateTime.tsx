import { DateTimeQuestion } from "@/lib/types/question";
import { DateTimePicker, DateTimePickerProps } from "@mantine/dates";

export type QuestionDateTimeProps = {
  question: DateTimeQuestion;
} & DateTimePickerProps;

export default function QuestionDateTime({
  question,
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
    />
  );
}
