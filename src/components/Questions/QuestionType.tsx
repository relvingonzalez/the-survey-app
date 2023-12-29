import { Process, Question } from "@/lib/types/question";
import QuestionText from "./QuestionTypes/QuestionText";
import QuestionPhone from "./QuestionTypes/QuestionPhone";
import QuestionEmail from "./QuestionTypes/QuestionEmail";

type QuestionTypeProps = {
  question: Question | Process;
};

export default function QuestionType({ question }: QuestionTypeProps) {
  const type = question.type;

  return (
    <>
      {type === "text" && <QuestionText question={question} />}
      {type === "phone" && <QuestionPhone question={question} />}
      {type === "email" && <QuestionEmail question={question} />}
    </>
  );
}
