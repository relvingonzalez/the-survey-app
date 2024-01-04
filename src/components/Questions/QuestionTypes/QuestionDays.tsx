import { Day, DaysQuestion } from "@/lib/types/question";
import { Checkbox, CheckboxProps, Group, Text } from "@mantine/core";
import { WithQuestionCallback } from "../Question";

export type QuestionDaysProps = {
  question: DaysQuestion;
} & WithQuestionCallback<DaysQuestion["answer"]["value"]> &
  CheckboxProps;

const daysOptions: Day[] = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];

export default function QuestionDays({
  question,
  onAnswered,
  ...props
}: QuestionDaysProps) {
  const checkedOption = (option: Day, checked: boolean) => {
    const newDays = [...question.answer.value];
    if (checked) {
      newDays.push(option);
    } else {
      newDays.splice(
        newDays.findIndex((day) => day === option),
        1,
      );
    }
    onAnswered(newDays);
  };

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
              onChange={(e) => {
                checkedOption(option, e.currentTarget.checked);
              }}
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
