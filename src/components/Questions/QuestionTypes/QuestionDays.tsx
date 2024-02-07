import { Day, DaysQuestion, ValueByQuestionType } from "@/lib/types/question";
import { Chip, ChipGroup, Group } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";

export type QuestionDaysProps = {
  question: DaysQuestion;
} & WithQuestionCallback<ValueByQuestionType<DaysQuestion>>;

type DayOption = {
  name: Day;
  value: number;
};
const daysOptions: Day[] = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const options: DayOption[] = [
  { name: "Monday", value: 1 },
  { name: "Tuesday", value: 2 },
  { name: "Wednesday", value: 3 },
  { name: "Thursday", value: 4 },
  { name: "Friday", value: 5 },
  { name: "Saturday", value: 6 },
  { name: "Sunday", value: 0 },
];
export function isDayArray(days: Day[] | string[]): days is Day[] {
  return (days as Day[]).every((item) => daysOptions.includes(item));
}

export default function QuestionDays({
  question,
  onAnswered,
}: QuestionDaysProps) {
  const value = question.answer.value || [];
  const handleSelected = (v: string[]) => {
    isDayArray(v) && onAnswered(v);
  };

  return (
    <ChipGroup multiple value={value} onChange={handleSelected}>
      <Group justify="left" mt="md">
        {options.map((o, i) => (
          <Chip key={i} value={o.value}>
            {o.name}
          </Chip>
        ))}
      </Group>
    </ChipGroup>
  );
}
