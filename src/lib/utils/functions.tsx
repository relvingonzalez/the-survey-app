import { Person, Salutation } from "../types/question";
import { NewRoom } from "../types/rooms";

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
