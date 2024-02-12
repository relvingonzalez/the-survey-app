import { Radio, RadioProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import { QuestionResponse, YesNoResponse } from "@/lib/types/question_new";

export type QuestionYesNoProps = {
  response: YesNoResponse[];
} & WithQuestionCallback<YesNoResponse> &
  RadioProps;

export function isYesNoResponse(
  response: QuestionResponse[],
): response is YesNoResponse[] {
  return (response as YesNoResponse[])[0]?.responseType === "yes/no";
}

const options = [
  { label: "Yes", value: true },
  { label: "No", value: false },
  { label: "Unknown", value: null },
];

export default function QuestionYesNo({
  response,
  onAnswered,
  ...props
}: QuestionYesNoProps) {
  const responseValue = response[0];
  return (
    <>
      {options.map((option, i) => {
        return (
          <Radio
            {...props}
            mt="sm"
            key={i}
            label={option.label}
            checked={option.value === responseValue.yesNo}
            onChange={(event) =>
              event.currentTarget.checked
                ? onAnswered({ ...responseValue, yesNo: option.value })
                : null
            }
          />
        );
      })}
    </>
  );
}
