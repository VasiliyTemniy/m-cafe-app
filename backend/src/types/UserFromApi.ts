import { isBoolean, isNumber, isString } from "./typeParsers.js";

interface UserFromAPIFields {
  id: unknown;
  username?: unknown;
  name?: unknown;
  phonenumber: unknown;
  email?: unknown;
  birthdate?: unknown;
  disabled: unknown;
  admin: unknown;  
}

export interface UserFromAPI {
  id: number;
  username?: string;
  name?: string;
  phonenumber: string;
  email?: string;
  birthdate?: Date;
  disabled: boolean;
  admin: boolean;
}

const hasUserFromAPIFields = (user: unknown): user is UserFromAPIFields =>
  Object.prototype.hasOwnProperty.call(user, "id")
  &&
  Object.prototype.hasOwnProperty.call(user, "phonenumber")
  &&
  Object.prototype.hasOwnProperty.call(user, "disabled")
  &&
  Object.prototype.hasOwnProperty.call(user, "admin");

export const isUserFromAPI = (user: unknown): user is UserFromAPI => {
  if (hasUserFromAPIFields(user)) {
    if (isNumber(user.id) && isString(user.phonenumber) && isBoolean(user.disabled) && isBoolean(user.admin)) return true;
  }
  return false;
};