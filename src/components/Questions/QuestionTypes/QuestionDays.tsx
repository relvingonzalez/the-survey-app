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
  { name: "Monday", value: 2 },
  { name: "Tuesday", value: 3 },
  { name: "Wednesday", value: 4 },
  { name: "Thursday", value: 5 },
  { name: "Friday", value: 6 },
  { name: "Saturday", value: 7 },
  { name: "Sunday", value: 1 },
];
export function isDayArray(days: Day[] | string[]): days is Day[] {
  return (days as Day[]).every((item) => daysOptions.includes(item));
}

// TODO find a better way so that we dont need || 0 . Probably have a typing that enforces all values will exist in object of options
export default function QuestionDays({
  question,
  onAnswered,
}: QuestionDaysProps) {
  const value = question.answer.value
    ? question.answer.value.map(
        (v) => options.find((o) => o.value === v)?.name || "",
      )
    : [];
  const handleSelected = (values: string[]) => {
    isDayArray(values) &&
      onAnswered(
        values.map((v) => options.find((o) => o.name === v)?.value || 0),
      );
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
