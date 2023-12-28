import { Process, Question } from "@/lib/types/question";
import QuestionText from "./QuestionTypes/QuestionText";

type QuestionTypeProps = {
  question: Question | Process;
};

export default function QuestionType({ question }: QuestionTypeProps) {
  const type = question.type;

  return <>{type === "text" && <QuestionText question={question} />}</>;
}
