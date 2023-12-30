import { QuestionTypeProps } from "../QuestionType";
import QuestionText from "./QuestionText";

export default function QuestionPhone(props: QuestionTypeProps) {
  return (
    <QuestionText
      {...props}
      type="tel"
      label="Telephone"
      placeholder="+9-(999)999-9999"
      pattern="^[0-9+()-]*$"
    />
  );
}
