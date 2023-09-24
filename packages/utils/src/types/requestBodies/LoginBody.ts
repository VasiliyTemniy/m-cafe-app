import { hasOwnProperty } from '../helpers.js';
import { isString } from '../typeParsers.js';

export interface LoginUserBody {
  username?: string;
  phonenumber?: string;
  password: string;
}

const hasUsernamePassword = (body: unknown): body is { username: unknown, password: unknown; } =>
  hasOwnProperty(body, 'username') && hasOwnProperty(body, 'password');

const hasPhonenumberPassword = (body: unknown): body is { phonenumber: unknown, password: unknown; } =>
  hasOwnProperty(body, 'phonenumber') && hasOwnProperty(body, 'password');


export const isLoginBody = (body: unknown): body is LoginUserBody =>
  (hasUsernamePassword(body) && isString(body.username) && isString(body.password))
  ||
  (hasPhonenumberPassword(body) && isString(body.phonenumber) && isString(body.password));