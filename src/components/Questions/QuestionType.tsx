import { ProcessByType, QuestionByType } from "@/lib/types/question";
import QuestionText, { isTextQuestion } from "./QuestionTypes/QuestionText";
import QuestionPhone from "./QuestionTypes/QuestionPhone";
import QuestionEmail from "./QuestionTypes/QuestionEmail";
import QuestionNumber from "./QuestionTypes/QuestionNumber";
import QuestionCheckbox from "./QuestionTypes/QuestionCheckbox";
import QuestionYesNo from "./QuestionTypes/QuestionYesNo";
import QuestionListSelect from "./QuestionTypes/QuestionListSelect";
import QuestionMultiple from "./QuestionTypes/QuestionMultiple";
import QuestionGeo from "./QuestionTypes/QuestionGeo";
import QuestionDateTime from "./QuestionTypes/QuestionDateTime";
import QuestionTime from "./QuestionTypes/QuestionTime";
import QuestionPerson from "./QuestionTypes/QuestionPerson";
import QuestionDays from "./QuestionTypes/QuestionDays";
import QuestionCollection from "./QuestionTypes/QuestionCollection";
import { WithQuestionCallback } from "./Question";

export type QuestionTypeProps<T> = {
  question: QuestionByType<T> | ProcessByType<T>;
} & WithQuestionCallback<T>;

export default function QuestionType<T>({
  question,
  onAnswered,
}: QuestionTypeProps<T>) {
  return (
    <>
      {question.type === "text" && (
        <QuestionText question={question} onAnswered={onAnswered} />
      )}
      {question.type === "phone" && <QuestionPhone question={question} />}
      {question.type === "email" && <QuestionEmail question={question} />}
      {question.type === "number" && <QuestionNumber question={question} />}
      {question.type === "checkbox" && <QuestionCheckbox question={question} />}
      {question.type === "yes/no" && <QuestionYesNo question={question} />}
      {question.type === "list" && <QuestionListSelect question={question} />}
      {question.type === "multiple" && <QuestionMultiple question={question} />}
      {question.type === "geo" && <QuestionGeo question={question} />}
      {question.type === "datetime" && <QuestionDateTime question={question} />}
      {question.type === "time" && <QuestionTime question={question} />}
      {question.type === "days" && <QuestionDays question={question} />}
      {question.type === "person" && <QuestionPerson question={question} />}
      {question.type === "collection" && (
        <QuestionCollection question={question} />
      )}
    </>
  );
}
