import { RefObject } from "react";
import { Person, Salutation } from "../types/question";
import { NewRoom } from "../types/rooms";
import * as changeKeys from "change-case/keys";

export const createPerson = (
  salut: Salutation = undefined,
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
  name = "",
  comment = "",
  racks = [],
  moreInfo = [],
): NewRoom => ({
  name,
  comment,
  racks,
  moreInfo,
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

export const isString = (value: unknown) => typeof value === 'string' || value instanceof String;
