import { BaseQuestionProps } from "../Question";
import QuestionText from "./QuestionText";

export default function QuestionEmail({ question }: BaseQuestionProps) {
  const pattern =
    '[a-z0-9!#$%&"*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&"*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';
  return (
    <QuestionText
      question={question}
      label="Email"
      type="email"
      placeholder="email@example.com"
      pattern={pattern}
    />
  );
}
