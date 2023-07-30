import { hasOwnProperty } from "../helpers.js";
import { isBoolean } from "../typeParsers.js";

export interface AdministrateUserBody {
  disable?: boolean;
  admin?: boolean;
}

const hasAdministrateUserBodyFields = (body: unknown): body is { disable: unknown; admin: unknown; } =>
  hasOwnProperty(body, "disable") || hasOwnProperty(body, "admin");

export const isAdministrateUserBody = (body: unknown): body is AdministrateUserBody =>
  hasAdministrateUserBodyFields(body) && (isBoolean(body.disable) || isBoolean(body.admin));