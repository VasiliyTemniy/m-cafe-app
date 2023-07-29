import { isString } from "../typeParsers.js";

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