"use client";

import { ActionIcon, Group, rem } from "@mantine/core";
import { TimeInput, TimeInputProps } from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import { ChangeEvent, useRef } from "react";
import { WithQuestionCallback } from "../SurveyItem";
import { TimeQuestion } from "@/lib/types/question";
import Response from "@/lib/dexie/Response";

export type QuestionTimeProps = {
  question: TimeQuestion;
  response: Response[];
} & WithQuestionCallback &
  TimeInputProps;

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

  const handleFromTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    responseValue.fromTime = e.target.value;
    onAnswered(responseValue);
  };

  const handleToTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    responseValue.toTime = e.target.value;
    onAnswered(responseValue);
  };

  return (
    <Group>
      <TimeInput
        {...props}
        label="From"
        ref={refFrom}
        rightSection={pickerControlFrom}
        defaultValue={responseValue.fromTime}
        onChange={handleFromTimeChange}
      />
      <TimeInput
        {...props}
        label="To"
        ref={refTo}
        rightSection={pickerControlTo}
        defaultValue={responseValue.toTime}
        onChange={handleToTimeChange}
      />
    </Group>
  );
}
