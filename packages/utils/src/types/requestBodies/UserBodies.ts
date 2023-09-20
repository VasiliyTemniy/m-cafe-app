import type { MapToUnknown } from "../helpers.js";
import type { UserDT } from "../../models/User.js";
import { hasOwnProperty } from "../helpers.js";
import { isString } from "../typeParsers.js";


export type NewUserBody = Omit<UserDT, 'rights' | 'id'> & { password: string; };

type NewUserBodyFields = MapToUnknown<NewUserBody>;

const hasNewUserBodyFields = (body: unknown): body is NewUserBodyFields =>
  hasOwnProperty(body, "password") && hasOwnProperty(body, "phonenumber");

export const isNewUserBody = (body: unknown): body is NewUserBody => {
  if (!hasNewUserBodyFields(body)) return false;

  if (
    (hasOwnProperty(body, "username") && !isString(body.username))
    ||
    (hasOwnProperty(body, "name") && !isString(body.name))
    ||
    (hasOwnProperty(body, "email") && !isString(body.email))
    ||
    (hasOwnProperty(body, "birthdate") && !isString(body.birthdate))
  ) return false;

  return isString(body.phonenumber) && isString(body.password);
};


export interface EditUserBody extends Omit<NewUserBody, 'phonenumber'> {
  newPassword?: string;
  phonenumber?: string;
}

type EditUserBodyFields = MapToUnknown<EditUserBody>;

const hasEditUserBodyFields = (body: unknown): body is EditUserBodyFields =>
  hasOwnProperty(body, "password");

export const isEditUserBody = (body: unknown): body is EditUserBody => {
  if (!hasEditUserBodyFields(body)) return false;

  if (
    (hasOwnProperty(body, "newPassword") && !isString(body.newPassword))
    ||
    (hasOwnProperty(body, "phonenumber") && !isString(body.phonenumber))
    ||
    (hasOwnProperty(body, "username") && !isString(body.username))
    ||
    (hasOwnProperty(body, "name") && !isString(body.name))
    ||
    (hasOwnProperty(body, "email") && !isString(body.email))
    ||
    (hasOwnProperty(body, "birthdate") && !isString(body.birthdate))
  ) return false;

  return isString(body.password);
};