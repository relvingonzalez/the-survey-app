import { RefObject } from "react";
import { Person } from "../types/question";
import * as changeKeys from "change-case/keys";
import {
  ActionFlag,
  DexieComment,
  DexieHardware,
  DexieMoreInfo,
  DexieRack,
  DexieResponse,
  DexieRoom,
} from "../types/dexie";
import { dayOptionsById } from "@/components/Questions/QuestionTypes/QuestionDays";
import {
  CheckboxResponse,
  DateTimeResponse,
  DaysResponse,
  EmailResponse,
  GeoResponse,
  ListResponse,
  MultipleResponse,
  NumberResponse,
  PersonResponse,
  PhoneResponse,
  QuestionResponse,
  TextResponse,
  TimeResponse,
  YesNoResponse,
} from "../types/question_new";
import {
  ServerCheckboxResponse,
  ServerComment,
  ServerDateTimeResponse,
  ServerDaysResponse,
  ServerEmailResponse,
  ServerGeoResponse,
  ServerHardware,
  ServerMoreInfo,
  ServerNumberResponse,
  ServerPersonResponse,
  ServerPhoneResponse,
  ServerRack,
  ServerRoom,
  ServerTextResponse,
  ServerTimeResponse,
  ServerYesNoResponse,
} from "../types/server_new";

export const createPerson = (
  salut = 0,
  firstName = "",
  lastName = "",
  email = "",
  phone = "",
): Person => {
  return {
    salut,
    firstName,
    lastName,
    email,
    phone,
  };
};

export const createRoom = (
  id: number,
  projectId: number,
  name = "",
  comment = "",
): DexieRoom => ({
  id,
  name,
  comment,
  projectId,
  flag: "i",
});

export const createMoreInfo = (
  roomId: number,
  x: number,
  y: number,
  id: number = uniqueId(),
  info = "",
): DexieMoreInfo => ({
  id,
  roomId,
  info,
  x,
  y,
  flag: "i",
});

export const createRack = (
  roomId: number,
  x: number,
  y: number,
  id: number = uniqueId(),
  name = "",
  comment = "",
): DexieRack => ({
  id,
  roomId,
  x,
  y,
  name,
  comment,
  flag: "i",
});

export const createHardware = (
  rackId: number,
  id: number = uniqueId(),
  name = "",
  fromSlot = "",
  toSlot = "",
  details = "",
): DexieHardware => ({
  id,
  rackId,
  name,
  fromSlot,
  toSlot,
  details,
  flag: "i",
});

export const getMousePosition = (
  ref: RefObject<HTMLElement>,
  e: MouseEvent,
) => {
  if (ref.current) {
    const rect = ref.current.getBoundingClientRect();

    const x = Math.max(
      0,
      Math.round(e.pageX - rect.left - (window.pageXOffset || window.scrollX)),
    );

    const y = Math.max(
      0,
      Math.round(e.pageY - rect.top - (window.pageYOffset || window.scrollY)),
    );

    return { x, y };
  } else {
    return { x: e.clientX, y: e.clientY };
  }
};

export const getTouchPosition = (
  ref: RefObject<HTMLElement>,
  e: TouchEvent,
) => {
  const touch = e.touches.length ? e.touches[0] : e.changedTouches[0];
  if (ref.current) {
    const rect = ref.current.getBoundingClientRect();

    const x = Math.max(
      0,
      Math.round(
        touch.pageX - rect.left - (window.pageXOffset || window.scrollX),
      ),
    );

    const y = Math.max(
      0,
      Math.round(
        touch.pageY - rect.top - (window.pageYOffset || window.scrollY),
      ),
    );

    return { x, y };
  } else {
    return { x: touch.clientX, y: touch.clientY };
  }
};

export function transformEntryFromServer<T extends object, K>(data: T) {
  return changeKeys.camelCase(data) as K;
}

export function transformEntriesFromServer<T extends object, K>(data: T[]) {
  return data.map((v) => transformEntryFromServer<T, K>(v));
}

export function transformEntryToServer<T extends object, K>(data: T) {
  return changeKeys.snakeCase(data) as K;
}

export function transformEntriesToServer<T extends object, K>(data: T[]) {
  return data.map((v) => transformEntryToServer<T, K>(v));
}

export const isString = (value: unknown) =>
  typeof value === "string" || value instanceof String;

export const getDisplayValue = (response?: DexieResponse) => {
  if (!response) {
    return "";
  }

  switch (response.responseType) {
    case "checkbox":
      return response.checked ? response.label : "";
    case "datetime":
      return response.date?.toDateString();
    case "days":
      return dayOptionsById[response.dayId];
    case "email":
      return response.email;
    case "geo":
      return `${response.lat}, ${response.long}`;
    case "list":
      return response.text;
    case "multiple":
      return response.text;
    case "number":
      return response.number;
    case "person":
      return `${response.firstName} ${response.lastName}`;
    case "phone":
      return response.phone;
    case "text":
      return response.text;
    case "time":
      return `From: ${response.fromTime}, To: ${response.toTime}`;
    case "yes/no":
      return response.yesNo === null
        ? "Unknown"
        : response.yesNo
          ? "Yes"
          : "No";
  }
};

export const getDisplayValues = (
  responses?: DexieResponse | DexieResponse[],
) => {
  if (responses instanceof Array) {
    return responses
      .map(getDisplayValue)
      .filter((v) => v)
      .join(", ");
  } else {
    return getDisplayValue(responses);
  }
};

const shouldIncludeId = (id?: number, flag?: ActionFlag) =>
  id && flag !== "i" && { id };

export const transformEmailResponse = ({
  id,
  questionResponseId,
  email,
}: EmailResponse): ServerEmailResponse => ({
  ...(id && { id }),
  questionResponseId,
  email,
});

export const transformCheckboxResponse = ({
  id,
  questionResponseId,
  label,
  checked,
}: CheckboxResponse): ServerCheckboxResponse => ({
  ...(id && { id }),
  questionResponseId,
  label,
  checked,
});

export const transformDatetimeResponse = ({
  id,
  questionResponseId,
  date,
}: DateTimeResponse): ServerDateTimeResponse => ({
  ...(id && { id }),
  questionResponseId,
  date,
});

export const transformDaysResponse = ({
  id,
  questionResponseId,
  dayId,
}: DaysResponse): ServerDaysResponse => ({
  ...(id && { id }),
  questionResponseId,
  dayId,
});

export const transformGeoResponse = ({
  id,
  questionResponseId,
  long,
  lat,
}: GeoResponse): ServerGeoResponse => ({
  ...(id && { id }),
  questionResponseId,
  geog: `SRID=4326;POINT(${long} ${lat})`,
});

export const transformNumberResponse = ({
  id,
  questionResponseId,
  number,
}: NumberResponse): ServerNumberResponse => ({
  ...(id && { id }),
  questionResponseId,
  number,
});

export const transformPersonResponse = ({
  id,
  questionResponseId,
  salutationId,
  firstName,
  lastName,
  email,
  phone,
}: PersonResponse): ServerPersonResponse => ({
  ...(id && { id }),
  questionResponseId,
  salutationId,
  firstName,
  lastName,
  email,
  phone,
});

export const transformPhoneResponse = ({
  id,
  questionResponseId,
  phone,
}: PhoneResponse): ServerPhoneResponse => ({
  ...(id && { id }),
  questionResponseId,
  phone,
});

export const transformTextResponse = ({
  id,
  questionResponseId,
  text,
}: TextResponse | ListResponse | MultipleResponse): ServerTextResponse => ({
  ...(id && { id }),
  questionResponseId,
  text,
});

export const transformTimeResponse = ({
  id,
  questionResponseId,
  fromTime,
  toTime,
}: TimeResponse): ServerTimeResponse => ({
  ...(id && { id }),
  questionResponseId,
  fromTime,
  toTime,
});

export const transformYesNoResponse = ({
  id,
  questionResponseId,
  yesNo,
}: YesNoResponse): ServerYesNoResponse => ({
  ...(id && { id }),
  questionResponseId,
  yesNo,
});

// Prepare local responses for server insert/modify
export const transformResponseToServerResponse = (
  response: QuestionResponse,
) => {
  switch (response.responseType) {
    case "checkbox":
      return transformCheckboxResponse(response);
    case "datetime":
      return transformDatetimeResponse(response);
    case "days":
      return transformDaysResponse(response);
    case "email":
      return transformEmailResponse(response);
    case "geo":
      return transformGeoResponse(response);
    case "number":
      return transformNumberResponse(response);
    case "person":
      return transformPersonResponse(response);
    case "phone":
      return transformPhoneResponse(response);
    case "time":
      return transformTimeResponse(response);
    case "yes/no":
      return transformYesNoResponse(response);
    default:
      return transformTextResponse(response);
  }
};

export const uniqueId = () => {
  return Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
};

export const transformComment = ({
  id,
  questionId,
  comment,
  responseGroupId,
  flag,
}: DexieComment): ServerComment => ({
  ...shouldIncludeId(id, flag),
  questionId,
  comment,
  responseGroupId: responseGroupId || null,
});

export const transformRoom = ({
  id,
  projectId,
  name,
  comment,
  flag,
}: DexieRoom): ServerRoom => ({
  ...shouldIncludeId(id, flag),
  projectId,
  name,
  comment,
});

export const transformRack = ({
  id,
  roomId,
  name,
  x,
  y,
  flag,
}: DexieRack): ServerRack => ({
  ...shouldIncludeId(id, flag),
  name,
  roomId,
  x,
  y,
});

export const transformMoreInfo = ({
  id,
  roomId,
  info,
  x,
  y,
  flag,
}: DexieMoreInfo): ServerMoreInfo => ({
  ...shouldIncludeId(id, flag),
  roomId,
  info,
  x,
  y,
});

export const transformHardware = ({
  id,
  rackId,
  name,
  fromSlot,
  toSlot,
  details,
  flag,
}: DexieHardware): ServerHardware => ({
  ...shouldIncludeId(id, flag),
  rackId,
  name,
  fromSlot,
  toSlot,
  details,
});
