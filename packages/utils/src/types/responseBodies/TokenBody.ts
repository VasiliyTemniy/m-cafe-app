import { hasOwnProperty } from "../helpers.js";
import { isNumber, isString } from "../typeParsers.js";

export interface TokenBody {
  token: string;
  id: number;
}

const hasTokenBodyFields = (body: unknown): body is { token: unknown, id: unknown; } =>
  hasOwnProperty(body, "token") && hasOwnProperty(body, "id");

export const isTokenBody = (body: unknown): body is TokenBody =>
  (hasTokenBodyFields(body) && isString(body.token) && isNumber(body.id));