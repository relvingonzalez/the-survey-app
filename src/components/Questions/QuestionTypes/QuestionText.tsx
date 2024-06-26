import { TextInput, TextInputProps } from "@mantine/core";
import {
  QuestionResponse,
  TextQuestion,
  TextResponse,
} from "@/lib/types/question_new";
import { WithQuestionCallback } from "../SurveyItem";
import { useState } from "react";

export type QuestionTextProps = {
  question: TextQuestion;
  response: TextResponse[];
} & WithQuestionCallback<TextResponse> &
  TextInputProps;

export declare function isTextQuestion(
  param: unknown,
): asserts param is TextQuestion;

export function isTextResponse(
  response: QuestionResponse[],
): response is TextResponse[] {
  return (
    (response as TextResponse[])[0]?.responseType === "text" || !response.length
  );
}

export const createTextResponse = (
  { projectId, id: questionId, responseType }: TextQuestion,
  text = " ",
): TextResponse => ({
  projectId,
  questionId,
  responseType,
  text,
});

export default function QuestionText({
  question,
  response,
  onAnswered,
  ...props
}: QuestionTextProps) {
  const responseValue = response[0] || createTextResponse(question);
  const [value, setValue] = useState(responseValue.text);

  const handleOnChange = (value: string) => {
    setValue(value);
    onAnswered({ ...responseValue, text: value });
  };

  return (
    <TextInput
      placeholder="Text"
      value={value}
      onChange={(e) => {
        handleOnChange(e.target.value);
      }}
      {...props}
    />
  );
}
