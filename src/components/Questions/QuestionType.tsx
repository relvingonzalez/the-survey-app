import { Process, Question } from "@/lib/types/question";
import QuestionText from "./QuestionTypes/QuestionText";
import QuestionPhone from "./QuestionTypes/QuestionPhone";
import QuestionEmail from "./QuestionTypes/QuestionEmail";
import QuestionNumber from "./QuestionTypes/QuestionNumber";
import QuestionCheckbox from "./QuestionTypes/QuestionCheckbox";
import QuestionYesNo from "./QuestionTypes/QuestionYesNo";
import QuestionListSelect from "./QuestionTypes/QuestionListSelect";
import QuestionMultiple from "./QuestionTypes/QuestionMultiple";
import { ChangeEventHandler } from "react";
import QuestionGeo from "./QuestionTypes/QuestionGeo";

export type QuestionTypeProps = {
  question: Question | Process;
  onChange: ChangeEventHandler;
};

export default function QuestionType({ question }: QuestionTypeProps) {
  return (
    <>
      {question.type === "text" && <QuestionText question={question} />}
      {question.type === "phone" && <QuestionPhone question={question} />}
      {question.type === "email" && <QuestionEmail question={question} />}
      {question.type === "number" && <QuestionNumber question={question} />}
      {question.type === "checkbox" && <QuestionCheckbox question={question} />}
      {question.type === "yes/no" && <QuestionYesNo question={question} />}
      {question.type === "list" && <QuestionListSelect question={question} />}
      {question.type === "multiple" && <QuestionMultiple question={question} />}
      {question.type === "geo" && <QuestionGeo question={question} />}
    </>
  );
}