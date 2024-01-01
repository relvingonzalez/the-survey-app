import { Day, DaysQuestion } from "@/lib/types/question";
import { Checkbox, CheckboxProps, Group, Text } from "@mantine/core";

export type QuestionDaysProps = {
  question: DaysQuestion;
} & CheckboxProps;

const daysOptions: Day[] = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

export default function QuestionDays({
  question,
  ...props
}: QuestionDaysProps) {
  return (
    <>
      <Group>
        {daysOptions.map((option, i) => {
          return (
            <Checkbox
              {...props}
              label={option}
              key={i}
              mt="10"
              checked={question.answer.value.includes(option)}
            />
          );
        })}
      </Group>
      <Text mt="10">{question.answer.value.toString()}</Text>
      <Text size="sm" c="dimmed">
        List of days of the week (the site is open)
      </Text>
    </>
  );
}
