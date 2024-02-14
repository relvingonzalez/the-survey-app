import { Question, QuestionResponse } from "@/lib/types/question_new";
import QuestionText, { isTextResponse } from "./QuestionTypes/QuestionText";
import QuestionPhone, { isPhoneResponse } from "./QuestionTypes/QuestionPhone";
import QuestionEmail, { isEmailResponse } from "./QuestionTypes/QuestionEmail";
import QuestionNumber, {
  isNumberResponse,
} from "./QuestionTypes/QuestionNumber";
import QuestionCheckbox, {
  isCheckboxResponse,
} from "./QuestionTypes/QuestionCheckbox";
import QuestionYesNo, { isYesNoResponse } from "./QuestionTypes/QuestionYesNo";
import QuestionListSelect, {
  isListResponse,
} from "./QuestionTypes/QuestionListSelect";
import QuestionMultiple, {
  isMultipleResponse,
} from "./QuestionTypes/QuestionMultiple";
import QuestionGeo, { isGeoResponse } from "./QuestionTypes/QuestionGeo";
import QuestionDateTime, {
  isDateTimeResponse,
} from "./QuestionTypes/QuestionDateTime";
import QuestionTime, { isTimeResponse } from "./QuestionTypes/QuestionTime";
import QuestionPerson, {
  isPersonResponse,
} from "./QuestionTypes/QuestionPerson";
import QuestionDays, { isDaysResponse } from "./QuestionTypes/QuestionDays";
import QuestionCollection from "./QuestionTypes/QuestionCollection";
import { WithQuestionCallback } from "./SurveyItem";

export type QuestionTypeProps<
  T extends Question,
  K extends QuestionResponse,
> = {
  question: T;
  response: K[];
} & WithQuestionCallback<QuestionResponse | QuestionResponse[]>;

export default function QuestionByTypeComponent<
  Q extends Question,
  R extends QuestionResponse,
>({ question, response, onAnswered }: QuestionTypeProps<Q, R>) {
  return (
    <>
      {question.responseType === "text" && isTextResponse(response) && (
        <QuestionText
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "phone" && isPhoneResponse(response) && (
        <QuestionPhone
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "email" && isEmailResponse(response) && (
        <QuestionEmail
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "number" && isNumberResponse(response) && (
        <QuestionNumber
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "checkbox" && isCheckboxResponse(response) && (
        <QuestionCheckbox
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "yes/no" && isYesNoResponse(response) && (
        <QuestionYesNo
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "list" && isListResponse(response) && (
        <QuestionListSelect
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "multiple" && isMultipleResponse(response) && (
        <QuestionMultiple
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "geo" && isGeoResponse(response) && (
        <QuestionGeo
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "datetime" && isDateTimeResponse(response) && (
        <QuestionDateTime
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "time" && isTimeResponse(response) && (
        <QuestionTime
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "days" && isDaysResponse(response) && (
        <QuestionDays
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "person" && isPersonResponse(response) && (
        <QuestionPerson
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
      {question.responseType === "collection" && (
        <QuestionCollection
          question={question}
          response={response}
          onAnswered={onAnswered}
        />
      )}
    </>
  );
}
