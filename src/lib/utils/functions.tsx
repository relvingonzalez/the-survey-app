import { RefObject } from "react";
import * as changeKeys from "change-case/keys";
import { ActionFlag, DexieResponse } from "../types/dexie";
import { dayOptionsById } from "@/components/Questions/QuestionTypes/QuestionDays";

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

export function transformEntrydeserialize<T extends object, K>(data: T) {
  return changeKeys.camelCase(data) as K;
}

export function transformEntriesdeserialize<T extends object, K>(data: T[]) {
  return data.map((v) => transformEntrydeserialize<T, K>(v));
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

export const shouldIncludeId = (id?: number, flag?: ActionFlag) =>
  id && flag !== "i" && { id };

export const uniqueId = () => {
  return Math.floor(Math.random() * Math.floor(Math.random() * Date.now()));
};
