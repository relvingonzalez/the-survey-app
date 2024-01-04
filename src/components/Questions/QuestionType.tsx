import {
  Question,
  QuestionType,
  ValueByQuestionType,
} from "@/lib/types/question";
import QuestionText from "./QuestionTypes/QuestionText";
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

export type QuestionTypeProps<T extends Question> = {
  question: T;
} & WithQuestionCallback<ValueByQuestionType<T>>;

export default function QuestionType<Q extends Question>({
  question,
  onAnswered,
}: QuestionTypeProps<Q>) {
  return (
    <>
      {question.type === "text" && (
        <QuestionText question={question} onAnswered={onAnswered} />
      )}
      {question.type === "phone" && (
        <QuestionPhone question={question} onAnswered={onAnswered} />
      )}
      {question.type === "email" && (
        <QuestionEmail question={question} onAnswered={onAnswered} />
      )}
      {question.type === "number" && (
        <QuestionNumber question={question} onAnswered={onAnswered} />
      )}
      {question.type === "checkbox" && (
        <QuestionCheckbox question={question} onAnswered={onAnswered} />
      )}
      {question.type === "yes/no" && (
        <QuestionYesNo question={question} onAnswered={onAnswered} />
      )}
      {question.type === "list" && (
        <QuestionListSelect question={question} onAnswered={onAnswered} />
      )}
      {question.type === "multiple" && (
        <QuestionMultiple question={question} onAnswered={onAnswered} />
      )}
      {question.type === "geo" && (
        <QuestionGeo question={question} onAnswered={onAnswered} />
      )}
      {question.type === "datetime" && (
        <QuestionDateTime question={question} onAnswered={onAnswered} />
      )}
      {question.type === "time" && (
        <QuestionTime question={question} onAnswered={onAnswered} />
      )}
      {question.type === "days" && (
        <QuestionDays question={question} onAnswered={onAnswered} />
      )}
      {question.type === "person" && (
        <QuestionPerson question={question} onAnswered={onAnswered} />
      )}
      {question.type === "collection" && (
        <QuestionCollection question={question} onAnswered={onAnswered} />
      )}
    </>
  );
}
