import { Day } from "@/lib/types/question";
import { Chip, ChipGroup, Group } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import { Question, Response } from "../../../../internal";

export type QuestionDaysProps = {
  question: Question;
  response: Response[];
} & WithQuestionCallback;

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

const dayOptionsByDay: Record<Day, number> = {
  Monday: 2,
  Tuesday: 3,
  Wednesday: 4,
  Thursday: 5,
  Friday: 6,
  Saturday: 7,
  Sunday: 1,
};

export const dayOptionsById: Record<number, Day> = {
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
  7: "Saturday",
  1: "Sunday",
};

export function isDayArray(days: Day[] | string[]): days is Day[] {
  return (days as Day[]).every((item) => !item || daysOptions.includes(item));
}

export const createDaysResponse = (
  { projectId, id: questionId, responseType }: Question,
  dayId: number,
) => Response.create({ projectId, questionId, responseType, dayId });

export default function QuestionDays({
  question,
  response,
  onAnswered,
}: QuestionDaysProps) {
  const value = response.map((v) => dayOptionsById[v.dayId]);
  const handleSelected = async (selection: string[]) => {
    if (isDayArray(selection)) {
      const result = await Promise.all(
        selection.map(
          (s) =>
            response.find((r) => dayOptionsById[r.dayId] === s) ??
            createDaysResponse(question, dayOptionsByDay[s]),
        ),
      );

      // Check which ones to remove and add flag
      const selectionsToRemove = daysOptions.filter(
        (o) => !selection.includes(o),
      );
      // const responsesToRemove = response
      //   .filter(
      //     (r) =>
      //       selectionsToRemove.includes(dayOptionsById[r.dayId]) || !r.dayId,
      //   )
      //   .map((r) => {
      //     r.flag = "d";
      //     return r;
      //   });

      response.forEach((r) => {
        if (selectionsToRemove.includes(dayOptionsById[r.dayId]) || !r.dayId) {
          r.delete();
        }
      });

      // onAnswered([...result, ...responsesToRemove]);
      onAnswered(result);
    }
  };

  return (
    <ChipGroup multiple value={value} onChange={handleSelected}>
      <Group justify="left" mt="md">
        {options.map((o, i) => (
          <Chip key={i} value={o.name}>
            {o.name}
          </Chip>
        ))}
      </Group>
    </ChipGroup>
  );
}
