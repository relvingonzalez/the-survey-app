import { Day, DaysQuestion, QuestionResponse } from "@/lib/types/question_new";
import { Chip, ChipGroup, Group } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import { DaysResponse } from "@/lib/types/question_new";

export type QuestionDaysProps = {
  question: DaysQuestion;
  response: DaysResponse[];
} & WithQuestionCallback<DaysResponse[]>;

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

const optionsObject: Record<Day, number> = {
  Monday: 2,
  Tuesday: 3,
  Wednesday: 4,
  Thursday: 5,
  Friday: 6,
  Saturday: 7,
  Sunday: 1,
};

const optionsObjectInverted: Record<number, Day> = {
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
  7: "Saturday",
  1: "Sunday",
};

export function isDayArray(days: Day[] | string[]): days is Day[] {
  return (days as Day[]).every((item) => daysOptions.includes(item));
}

const createDaysResponse = (
  { projectId, id: questionId, responseType }: DaysQuestion,
  dayId: number,
) => ({
  projectId,
  questionId,
  responseType,
  dayId,
});

export function isDaysResponse(
  response: QuestionResponse[],
): response is DaysResponse[] {
  return (response as DaysResponse[])[0].dayId !== undefined;
}

export default function QuestionDays({
  question,
  response,
  onAnswered,
}: QuestionDaysProps) {
  const value = response.map((v) => optionsObjectInverted[v.dayId]);
  const handleSelected = (selection: string[]) => {
    if (isDayArray(selection)) {
      // Check if exists or add
      // TODO set flag to something other than d
      const result = selection.map((s) => {
        const res =
          response.find((r) => optionsObjectInverted[r.dayId] === s) ||
          createDaysResponse(question, optionsObject[s]);
        return { ...res, flag: "" };
      });

      // Check which ones to remove and add flag
      const selectionsToRemove = daysOptions.filter(
        (o) => !selection.includes(o),
      );
      const responsesToRemove = response
        .filter((r) =>
          selectionsToRemove.includes(optionsObjectInverted[r.dayId]),
        )
        .map((s) => ({ ...s, flag: "d" }));

      onAnswered([...result, ...responsesToRemove]);
    }
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
