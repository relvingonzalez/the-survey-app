import { Person, Salutation } from "../types/question";

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
