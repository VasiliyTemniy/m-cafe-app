import { InferAttributes } from "sequelize";
import { User } from "../../models/User.js";
import { MapToFrontendData, MapToUnknown, PropertiesCreationOptional } from "../helpers.js";
import { isString } from "../typeParsers.js";


export type NewUserBody = MapToFrontendData<
  Omit<InferAttributes<User>, PropertiesCreationOptional | 'admin' | 'disabled' | 'passwordHash'>
> & {
  password: string;
};

export type NewUserBodyFields = MapToUnknown<NewUserBody>;


export const hasUsernamePassword = (body: unknown): body is { username: unknown, password: unknown; } =>
  Object.prototype.hasOwnProperty.call(body, "username")
  &&
  Object.prototype.hasOwnProperty.call(body, "password");

export const hasPhonenumberPassword = (body: unknown): body is { phonenumber: unknown, password: unknown; } =>
  Object.prototype.hasOwnProperty.call(body, "phonenumber")
  &&
  Object.prototype.hasOwnProperty.call(body, "password");


export const isNewUserBody = (body: unknown): body is NewUserBody =>
  hasPhonenumberPassword(body) && isString(body.phonenumber) && isString(body.password);


export interface EditUserBody extends Omit<NewUserBody, 'phonenumber'> {
  newPassword?: string;
  phonenumber?: string;
}

export const isEditUserBody = (body: unknown): body is EditUserBody =>
  hasPhonenumberPassword(body) && isString(body.phonenumber) && isString(body.password);