import { TextInput, TextInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import {
  PhoneQuestion,
  PhoneResponse,
  QuestionResponse,
} from "@/lib/types/question_new";

export type QuestionPhoneProps = {
  response: PhoneResponse[];
} & WithQuestionCallback<PhoneResponse> &
  TextInputProps;

export const phonePattern =
  "^(\\+\\d{1,2}\\s)?\\(?\\d{3}\\)?[\\s.-]\\d{3}[\\s.-]\\d{4}$";
export const phonePatternRegex = new RegExp(phonePattern);

export function isPhoneResponse(
  response: QuestionResponse[],
): response is PhoneResponse[] {
  return (response as PhoneResponse[])[0]?.responseType === "phone";
}

export const createPhoneResponse = (
  { projectId, id: questionId, responseType }: PhoneQuestion,
  phone = "",
): PhoneResponse => ({
  projectId,
  questionId,
  responseType,
  phone,
});

export default function QuestionPhone({
  response,
  onAnswered,
  ...props
}: QuestionPhoneProps) {
  const responseValue = response[0];
  const handleOnChange = (value: string) => {
    onAnswered({ ...responseValue, phone: value });
  };

  return (
    <TextInput
      {...props}
      value={responseValue.phone}
      type="tel"
      label="Telephone"
      placeholder="+9-(999)999-9999"
      pattern={phonePattern}
      onChange={(e) => {
        handleOnChange(e.target.value);
      }}
    />
  );
}
