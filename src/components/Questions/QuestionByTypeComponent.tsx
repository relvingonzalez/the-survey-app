import { Question } from "@/lib/types/question";
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
import { WithQuestionCallback } from "./SurveyItem";
import Response from "@/lib/dexie/Response";

export type QuestionTypeProps<T extends Question, K extends Response> = {
  question: T;
  response: K[];
} & WithQuestionCallback;

export default function QuestionByTypeComponent<
  Q extends Question,
  R extends Response,
>({ question, response, onAnswered }: QuestionTypeProps<Q, R>) {
  return (
    <>
      {question.responseType === "text" && (
        <QuestionText
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "phone" && (
        <QuestionPhone
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "email" && (
        <QuestionEmail
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "number" && (
        <QuestionNumber
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "checkbox" && (
        <QuestionCheckbox
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "yes/no" && (
        <QuestionYesNo
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "list" && (
        <QuestionListSelect
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "multiple" && (
        <QuestionMultiple
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "geo" && (
        <QuestionGeo
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "datetime" && (
        <QuestionDateTime
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "time" && (
        <QuestionTime
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "days" && (
        <QuestionDays
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "person" && (
        <QuestionPerson
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "collection" && (
        <QuestionCollection question={question} onAnswered={onAnswered} />
      )}
    </>
  );
}
