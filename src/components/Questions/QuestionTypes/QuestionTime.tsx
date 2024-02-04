"use client";

import { TimeQuestion, ValueByQuestionType } from "@/lib/types/question";
import { ActionIcon, Group, rem } from "@mantine/core";
import { TimeInput, TimeInputProps } from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import { useRef } from "react";
import { WithQuestionCallback } from "../SurveyItem";

export type QuestionTimeProps = {
  question: TimeQuestion;
} & WithQuestionCallback<ValueByQuestionType<TimeQuestion>> &
  TimeInputProps;

export default function QuestionTime({
  question,
  onAnswered,
  ...props
}: QuestionTimeProps) {
  const refFrom = useRef<HTMLInputElement>(null);
  const refTo = useRef<HTMLInputElement>(null);
  const value = question.answer.value || { fromTime: "", toTime: "" };

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
        defaultValue={value.fromTime}
        onChange={(e) =>
          onAnswered({
            fromTime: e.target.value,
            toTime: value.toTime,
          })
        }
      />
      <TimeInput
        {...props}
        label="To"
        ref={refTo}
        rightSection={pickerControlTo}
        defaultValue={value.toTime}
        onChange={(e) =>
          onAnswered({
            fromTime: value.fromTime,
            toTime: e.target.value,
          })
        }
      />
    </Group>
  );
}
