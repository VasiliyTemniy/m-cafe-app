import { UserData } from "@m-cafe-app/db-models";
import { isBoolean, isNumber, isString } from "../types/typeParsers.js";
import { hasOwnProperty, MapToDT, MapToUnknown } from "../types/helpers.js";


export type UserDT = Omit<MapToDT<UserData>, 'passwordHash'>;

type UserDTFields = MapToUnknown<UserDT>;

const hasUserDTFields = (obj: unknown): obj is UserDTFields =>
  hasOwnProperty(obj, "id")
  &&
  hasOwnProperty(obj, "phonenumber");

export const isUserDT = (obj: unknown): obj is UserDT => {
  if (!hasUserDTFields(obj)) return false;

  if (
    (hasOwnProperty(obj, "username") && !isString(obj.username))
    ||
    (hasOwnProperty(obj, "name") && !isString(obj.name))
    ||
    (hasOwnProperty(obj, "email") && !isString(obj.email))
    ||
    (hasOwnProperty(obj, "birthdate") && !isString(obj.birthdate))
    ||
    (hasOwnProperty(obj, "disabled") && !isBoolean(obj.disabled))
    ||
    (hasOwnProperty(obj, "admin") && !isBoolean(obj.admin))
  ) return false;

  return isNumber(obj.id) && isString(obj.phonenumber);
};