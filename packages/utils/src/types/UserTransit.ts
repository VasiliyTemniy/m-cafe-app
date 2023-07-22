import { isBoolean, isNumber, isString } from "./typeParsers.js";

interface UserTransitFields {
  id: unknown;
  username?: unknown;
  name?: unknown;
  phonenumber: unknown;
  email?: unknown;
  birthdate?: unknown;
  disabled: unknown;
  admin: unknown;
}

export interface UserTransit {
  id: number;
  username?: string;
  name?: string;
  phonenumber: string;
  email?: string;
  birthdate?: Date;
  disabled: boolean;
  admin: boolean;
}

const hasUserTransitFields = (user: unknown): user is UserTransitFields =>
  Object.prototype.hasOwnProperty.call(user, "id")
  &&
  Object.prototype.hasOwnProperty.call(user, "phonenumber")
  &&
  Object.prototype.hasOwnProperty.call(user, "disabled")
  &&
  Object.prototype.hasOwnProperty.call(user, "admin");

export const isUserTransit = (user: unknown): user is UserTransit => {
  if (hasUserTransitFields(user)) {
    if (isNumber(user.id) && isString(user.phonenumber) && isBoolean(user.disabled) && isBoolean(user.admin)) return true;
  }
  return false;
};