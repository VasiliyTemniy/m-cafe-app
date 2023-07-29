import { InferAttributes } from "sequelize";
import { User } from "../../models/User.js";
import { MapToFrontendData, MapToUnknown, PropertiesCreationOptional } from "../helpers.js";
import { isString } from "../typeParsers.js";


export type NewUserBody = MapToFrontendData<
  Omit<InferAttributes<User>, PropertiesCreationOptional | 'admin' | 'disabled' | 'passwordHash'>
> & {
  password: string;
};

type NewUserBodyFields = MapToUnknown<NewUserBody>;

const hasNewUserBodyFields = (body: unknown): body is NewUserBodyFields =>
  Object.prototype.hasOwnProperty.call(body, "password")
  &&
  Object.prototype.hasOwnProperty.call(body, "phonenumber");

export const isNewUserBody = (body: unknown): body is NewUserBody => {
  if (!hasNewUserBodyFields(body)) return false;

  if (
    (Object.prototype.hasOwnProperty.call(body, "username") && !isString(body.username))
    ||
    (Object.prototype.hasOwnProperty.call(body, "name") && !isString(body.name))
    ||
    (Object.prototype.hasOwnProperty.call(body, "email") && !isString(body.email))
    ||
    (Object.prototype.hasOwnProperty.call(body, "birthdate") && !isString(body.birthdate))
  ) return false;

  return isString(body.phonenumber) && isString(body.password);
};


export interface EditUserBody extends Omit<NewUserBody, 'phonenumber'> {
  newPassword?: string;
  phonenumber?: string;
}

type EditUserBodyFields = MapToUnknown<EditUserBody>;

const hasEditUserBodyFields = (body: unknown): body is EditUserBodyFields =>
  Object.prototype.hasOwnProperty.call(body, "password");

export const isEditUserBody = (body: unknown): body is EditUserBody => {
  if (!hasEditUserBodyFields(body)) return false;

  if (
    (Object.prototype.hasOwnProperty.call(body, "newPassword") && !isString(body.newPassword))
    ||
    (Object.prototype.hasOwnProperty.call(body, "phonenumber") && !isString(body.phonenumber))
    ||
    (Object.prototype.hasOwnProperty.call(body, "username") && !isString(body.username))
    ||
    (Object.prototype.hasOwnProperty.call(body, "name") && !isString(body.name))
    ||
    (Object.prototype.hasOwnProperty.call(body, "email") && !isString(body.email))
    ||
    (Object.prototype.hasOwnProperty.call(body, "birthdate") && !isString(body.birthdate))
  ) return false;

  return isString(body.password);
};