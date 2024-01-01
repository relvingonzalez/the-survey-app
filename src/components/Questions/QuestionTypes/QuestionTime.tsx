"use client";

import { TimeQuestion } from "@/lib/types/question";
import { ActionIcon, Group, rem } from "@mantine/core";
import { TimeInput, TimeInputProps } from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import { useRef } from "react";

export type QuestionTimeProps = {
  question: TimeQuestion;
} & TimeInputProps;

export default function QuestionTime({
  question,
  ...props
}: QuestionTimeProps) {
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
        defaultValue={question.answer.value.fromTime}
      />
      <TimeInput
        {...props}
        label="To"
        ref={refTo}
        rightSection={pickerControlTo}
        defaultValue={question.answer.value.toTime}
      />
    </Group>
  );
}
