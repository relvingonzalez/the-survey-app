import { BaseQuestionProps } from "../Question";
import QuestionText from "./QuestionText";

export default function QuestionPhone({ question }: BaseQuestionProps) {
  return (
    <QuestionText
      question={question}
      type="tel"
      label="Telephone"
      placeholder="+9-(999)999-9999"
      pattern="^[0-9+()-]*$"
    />
  );
}
