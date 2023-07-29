import { isBoolean } from "../typeParsers.js";

export interface DisableUserBody {
  disable: boolean;
}

const hasDisableUserBodyFields = (body: unknown): body is { disable: unknown; } =>
  Object.prototype.hasOwnProperty.call(body, "disable");

export const isDisableUserBody = (body: unknown): body is DisableUserBody =>
  hasDisableUserBodyFields(body) && isBoolean(body.disable);