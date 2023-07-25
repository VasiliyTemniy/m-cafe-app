import { isBoolean, isString } from "./typeParsers.js";

export interface DisableUserBody {
  disable: boolean;
}

const hasDisableUserBodyFields = (body: unknown): body is { disable: unknown; } =>
  Object.prototype.hasOwnProperty.call(body, "disable");

export const isDisableUserBody = (body: unknown): body is DisableUserBody => {
  if (hasDisableUserBodyFields(body)) {
    if (isBoolean(body.disable)) return true;
  }
  return false;
};

export interface LoginUserBody {
  username?: string;
  phonenumber?: string;
  password: string;
}

const hasUsernamePassword = (body: unknown): body is { username: unknown, password: unknown; } =>
  Object.prototype.hasOwnProperty.call(body, "username")
  &&
  Object.prototype.hasOwnProperty.call(body, "password");

const hasPhonenumberPassword = (body: unknown): body is { phonenumber: unknown, password: unknown; } =>
  Object.prototype.hasOwnProperty.call(body, "phonenumber")
  &&
  Object.prototype.hasOwnProperty.call(body, "password");

export const isLoginBody = (body: unknown): body is LoginUserBody =>
  (hasUsernamePassword(body) && isString(body.username) && isString(body.password))
  ||
  (hasPhonenumberPassword(body) && isString(body.phonenumber) && isString(body.password));

export interface NewUserBody {
  username?: string;
  name?: string;
  password: string;
  phonenumber: string;
  email?: string;
  birthdate?: string;
}

export const isNewUserBody = (body: unknown): body is NewUserBody =>
  hasPhonenumberPassword(body) && isString(body.phonenumber) && isString(body.password);

export interface EditUserBody extends NewUserBody {
  newPassword?: string;
}

export const isEditUserBody = (body: unknown): body is EditUserBody =>
  hasPhonenumberPassword(body) && isString(body.phonenumber) && isString(body.password);