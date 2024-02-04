import { Day, DaysQuestion, ValueByQuestionType } from "@/lib/types/question";
import { Chip, ChipGroup, Group } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";

export type QuestionDaysProps = {
  question: DaysQuestion;
} & WithQuestionCallback<ValueByQuestionType<DaysQuestion>>;

type DayOption = {
  name: string;
  value: Day;
};
const daysOptions: Day[] = ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"];
const options: DayOption[] = [
  { name: "Monday", value: "Mon" },
  { name: "Tuesday", value: "Tue" },
  { name: "Wednesday", value: "Wed" },
  { name: "Thursday", value: "Thur" },
  { name: "Friday", value: "Fri" },
  { name: "Saturday", value: "Sat" },
  { name: "Sunday", value: "Sun" },
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
