import { TextInput, TextInputProps } from "@mantine/core";
import {
  QuestionResponse,
  TextQuestion,
  TextResponse,
} from "@/lib/types/question_new";
import { WithQuestionCallback } from "../SurveyItem";

export type QuestionTextProps = {
  response: TextResponse[];
} & WithQuestionCallback<TextResponse> &
  TextInputProps;

export declare function isTextQuestion(
  param: unknown,
): asserts param is TextQuestion;

export function isTextResponse(
  response: QuestionResponse[],
): response is TextResponse[] {
  return (response as TextResponse[])[0]?.responseType === "text";
}

export default function QuestionText({
  response,
  onAnswered,
  ...props
}: QuestionTextProps) {
  const responseValue = response[0];
  const handleOnChange = (value: string) => {
    onAnswered({ ...responseValue, text: value });
  };

  return (
    <TextInput
      placeholder="Text"
      value={responseValue.text}
      onChange={(e) => {
        handleOnChange(e.target.value);
      }}
      {...props}
    />
  );
}
