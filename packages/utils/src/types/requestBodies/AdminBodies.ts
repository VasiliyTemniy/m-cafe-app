import { hasOwnProperty } from "../helpers.js";
import { isBoolean } from "../typeParsers.js";

export interface AdministrateUserBody {
  disabled?: boolean;
  admin?: boolean;
}

const hasAdministrateUserBodyFields = (body: unknown): body is { disabled: unknown; admin: unknown; } =>
  hasOwnProperty(body, "disabled") || hasOwnProperty(body, "admin");

export const isAdministrateUserBody = (body: unknown): body is AdministrateUserBody =>
  hasAdministrateUserBodyFields(body) && (isBoolean(body.disabled) || isBoolean(body.admin));