import { QuestionTypeProps } from "../QuestionType";
import QuestionText from "./QuestionText";

export default function QuestionNumber({
  question,
  onChange,
}: QuestionTypeProps) {
  return (
    <QuestionText
      question={question}
      type="number"
      label="Number"
      min="0"
      onKeyDown={(event) => {
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        }
      }}
      onChange={onChange}
    />
  );
}
