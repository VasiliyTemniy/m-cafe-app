import { isNumber, isString } from "./typeParsers";

export interface TokenBody {
  token: string;
  id: number;
}

const hasTokenBodyFields = (body: unknown): body is { token: unknown, id: unknown; } =>
  Object.prototype.hasOwnProperty.call(body, "token")
  &&
  Object.prototype.hasOwnProperty.call(body, "id");

export const isTokenBody = (body: unknown): body is TokenBody =>
  (hasTokenBodyFields(body) && isString(body.token) && isNumber(body.id));