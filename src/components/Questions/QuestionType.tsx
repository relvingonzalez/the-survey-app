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

export type QuestionTypeProps = {
  question: Question | Process;
  onChange: ChangeEventHandler;
};

export default function QuestionType(props: QuestionTypeProps) {
  const type = props.question.type;

  return (
    <>
      {type === "text" && <QuestionText {...props} />}
      {type === "phone" && <QuestionPhone {...props} />}
      {type === "email" && <QuestionEmail {...props} />}
      {type === "number" && <QuestionNumber {...props} />}
      {type === "checkbox" && <QuestionCheckbox {...props} />}
      {type === "yes/no" && <QuestionYesNo {...props} />}
      {type === "list" && <QuestionListSelect {...props} />}
      {type === "multiple" && <QuestionMultiple {...props} />}
    </>
  );
}
