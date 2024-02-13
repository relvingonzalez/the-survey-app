import { TextInput, TextInputProps } from "@mantine/core";
import { WithQuestionCallback } from "../SurveyItem";
import {
  EmailQuestion,
  EmailResponse,
  QuestionResponse,
} from "@/lib/types/question_new";

export type QuestionEmailProps = {
  response: EmailResponse[];
} & WithQuestionCallback<EmailResponse> &
  TextInputProps;

export const emailPattern =
  '[a-z0-9!#$%&"*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&"*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';

export const emailPatternRegex = new RegExp(
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
);

export function isEmailResponse(
  response: QuestionResponse[],
): response is EmailResponse[] {
  return (response as EmailResponse[])[0]?.responseType === "email";
}

export const createEmailResponse = (
  { projectId, id: questionId, responseType }: EmailQuestion,
  email: string = "",
): EmailResponse => ({
  projectId,
  questionId,
  responseType,
  email,
});

export default function QuestionEmail({
  response,
  onAnswered,
  ...props
}: QuestionEmailProps) {
  const responseValue = response[0];
  const handleOnChange = (value: string) => {
    onAnswered({ ...responseValue, email: value });
  };
  return (
    <TextInput
      {...props}
      value={responseValue.email}
      label="Email"
      type="email"
      placeholder="email@example.com"
      pattern={emailPattern}
      onChange={(e) => {
        handleOnChange(e.target.value);
      }}
    />
  );
}
