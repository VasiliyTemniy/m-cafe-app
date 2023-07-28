import { isString } from "../typeParsers.js";
import { hasPhonenumberPassword, hasUsernamePassword } from "./UserBodies.js";

export interface LoginUserBody {
  username?: string;
  phonenumber?: string;
  password: string;
}

export const isLoginBody = (body: unknown): body is LoginUserBody =>
  (hasUsernamePassword(body) && isString(body.username) && isString(body.password))
  ||
  (hasPhonenumberPassword(body) && isString(body.phonenumber) && isString(body.password));