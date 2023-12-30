import { BaseQuestionProps } from "../Question";
import QuestionText from "./QuestionText";

export default function QuestionYesNo({ question }: BaseQuestionProps) {
  //question.answer[option]
  const options = ["Yes", "No", "Unknown"];
  return (
    <>
      {options.map((option, i) => {
        return (
          <QuestionText
            question={question}
            type="radio"
            label={option}
            min="0"
            key={i}
            name="radio"
          />
        );
      })}
    </>
  );
}
