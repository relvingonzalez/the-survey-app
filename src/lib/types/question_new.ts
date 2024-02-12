// Value option types
export type Day =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";
export type Salutation = "Mr" | "Ms" | undefined;
export type Person = {
  salutationId: number | undefined;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};
type Time = {
  fromTime: string;
  toTime: string;
};
export type YesNoLabel = "Yes" | "No" | "Unknown";
export type YesNo = boolean | null;
// type QuestionCollectionResponse<T> = Extract<Extract<Question, { type: T }>,  'answer'>;
// export type EntryResponse<T> = {
//   question: string;
//   type: T;
//   answer: QuestionCollectionResponse<T>
// };
// export type EntryResponses = EntryResponse<QuestionType>[];

// export type EntryResponses = Question[];

// export type Entries = Exclude<Question, "CollectionQuestion">[];

// Question Response Value types
type TextValue = { text: string };
type NumberValue = { number: number };
type ListValue = { text: string | null };
type EmailValue = { email: string };
type CheckboxValue = { label: string; checked: boolean };
type DateTimeValue = { date: Date };
type DaysValue = { dayId: number };
type MultipleValue = { text: string };
type PersonValue = Person;
type TimeValue = Time;
type YesNoValue = { yesNo?: YesNo };
type GeoValue = { lat: number; long: number };
type PhoneValue = { phone: string };

export type QuestionValue =
  | ListValue
  | TextValue
  | EmailValue
  | CheckboxValue
  | DateTimeValue
  | DaysValue
  | MultipleValue
  | PersonValue
  | TimeValue
  | YesNoValue
  | GeoValue;

//export type ValueByQuestionType<T extends Question> = T["answer"]["value"];

// Response by Question Type
export type Comment = {
  responseId: number;
  comment: string;
};

export type TextResponse = BaseResponse & TextValue;
export type EmailResponse = BaseResponse & EmailValue;
export type CheckboxResponse = BaseResponse & CheckboxValue;
export type DateTimeResponse = BaseResponse & DateTimeValue;
export type DaysResponse = BaseResponse & DaysValue;
export type MultipleResponse = BaseResponse & MultipleValue;
export type PersonResponse = BaseResponse & PersonValue;
export type TimeResponse = BaseResponse & TimeValue;
export type YesNoResponse = BaseResponse & YesNoValue;
export type GeoResponse = BaseResponse & GeoValue;
export type ListResponse = BaseResponse & ListValue;
export type NumberResponse = BaseResponse & NumberValue;
export type PhoneResponse = BaseResponse & PhoneValue;

export type QuestionResponse =
  | PhoneResponse
  | NumberResponse
  | ListResponse
  | TextResponse
  | EmailResponse
  | CheckboxResponse
  | DateTimeResponse
  | DaysResponse
  | MultipleResponse
  | PersonResponse
  | TimeResponse
  | YesNoResponse
  | GeoResponse;
export type CollectionResponse = QuestionResponse;

// Question by Type

export type CheckboxQuestion = BaseQuestion & {
  responseType: "checkbox";
  options: ListOptions;
};

export type EmailQuestion = BaseQuestion & {
  responseType: "email";
};

export type GeoQuestion = BaseQuestion & {
  responseType: "geo";
};

export type NumberQuestion = BaseQuestion & {
  responseType: "number";
};

export type PhoneQuestion = BaseQuestion & {
  responseType: "phone";
};

export type TextQuestion = BaseQuestion & {
  responseType: "text";
};

export type ListQuestion = BaseQuestion & {
  responseType: "list";
  options: ListOptions;
};

export type DateTimeQuestion = BaseQuestion & {
  responseType: "datetime";
};

export type DaysQuestion = BaseQuestion & {
  responseType: "days";
};

export type MultipleQuestion = BaseQuestion & {
  responseType: "multiple";
  options: ListOptions;
};

export type PersonQuestion = BaseQuestion & {
  responseType: "person";
};

export type TimeQuestion = BaseQuestion & {
  responseType: "time";
};

export type YesNoQuestion = BaseQuestion & {
  responseType: "yes/no";
};

export type CollectionQuestion = BaseQuestion & {
  responseType: "collection";
};

export type Question =
  | CheckboxQuestion
  | EmailQuestion
  | GeoQuestion
  | NumberQuestion
  | PhoneQuestion
  | TextQuestion
  | ListQuestion
  | DateTimeQuestion
  | DaysQuestion
  | MultipleQuestion
  | PersonQuestion
  | TimeQuestion
  | YesNoQuestion
  | CollectionQuestion;

export type TextQuestionWithResponse = TextQuestion & TextResponse;

export type QuestionWithResponse = TextQuestionWithResponse;

// Response types
type ListOptions = string[];

export type ResponseType =
  | "checkbox"
  | "collection"
  | "datetime"
  | "days"
  | "email"
  | "geo"
  | "list"
  | "multiple"
  | "number"
  | "person"
  | "phone"
  | "text"
  | "time"
  | "yes/no";

export type QuestionType = "question" | "process" | "rack";

type BaseQuestion = {
  id?: number;
  projectId?: number;
  rackId?: number;
  collectionId?: number;
  question: string;
  order: number;
  subheading?: string;
  responseType: ResponseType;
  questionType: QuestionType;
};

type BaseResponse = {
  id?: number;
  projectId?: number;
  questionId?: number;
  responseType: ResponseType;
};

export type Process = Question;

export type Questions = Question[];

export type Processes = Questions;
