import type { UserData } from "@m-cafe-app/db-models";
import { isNumber, isString } from "../types/typeParsers.js";
import { hasOwnProperty, MapToDT, MapToUnknown } from "../types/helpers.js";
import { ApplicationError } from "../types/Errors.js";


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
    (hasOwnProperty(obj, "rights") && !isString(obj.rights))
  ) return false;

  if (hasOwnProperty(obj, 'passwordHash')) throw new ApplicationError('User data transit passwordHash detected! Please, contact admins');

  return isNumber(obj.id) && isString(obj.phonenumber);
};