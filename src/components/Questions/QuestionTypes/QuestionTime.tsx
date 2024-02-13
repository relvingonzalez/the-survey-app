"use client";

import { ActionIcon, Group, rem } from "@mantine/core";
import { TimeInput, TimeInputProps } from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import { useRef } from "react";
import { WithQuestionCallback } from "../SurveyItem";
import {
  QuestionResponse,
  TimeQuestion,
  TimeResponse,
} from "@/lib/types/question_new";

export type QuestionTimeProps = {
  response: TimeResponse[];
} & WithQuestionCallback<TimeResponse> &
  TimeInputProps;

export function isTimeResponse(
  response: QuestionResponse[],
): response is TimeResponse[] {
  return (response as TimeResponse[])[0]?.responseType === "time";
}

export const createTimeResponse = (
  { projectId, id: questionId, responseType }: TimeQuestion,
  fromTime = new Date().toISOString(),
  toTime = new Date().toISOString(),
): TimeResponse => ({
  projectId,
  questionId,
  responseType,
  fromTime,
  toTime,
});

export default function QuestionTime({
  response,
  onAnswered,
  ...props
}: QuestionTimeProps) {
  const responseValue = response[0];
  const refFrom = useRef<HTMLInputElement>(null);
  const refTo = useRef<HTMLInputElement>(null);

  const pickerControlFrom = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => refFrom.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const pickerControlTo = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => refTo.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  return (
    <Group>
      <TimeInput
        {...props}
        label="From"
        ref={refFrom}
        rightSection={pickerControlFrom}
        defaultValue={responseValue.fromTime}
        onChange={(e) =>
          onAnswered({ ...responseValue, fromTime: e.target.value })
        }
      />
      <TimeInput
        {...props}
        label="To"
        ref={refTo}
        rightSection={pickerControlTo}
        defaultValue={responseValue.toTime}
        onChange={(e) =>
          onAnswered({ ...responseValue, toTime: e.target.value })
        }
      />
    </Group>
  );
}
