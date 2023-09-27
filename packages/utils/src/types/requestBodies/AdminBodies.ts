import { hasOwnProperty } from '../helpers.js';
import { isBoolean, isString } from '../typeParsers.js';

export interface AdministrateUserBody {
  rights?: string;
  restore?: boolean;
}

const hasAdministrateUserBodyFields = (body: unknown): body is { rights: unknown, restore: unknown; } =>
  hasOwnProperty(body, 'rights') || hasOwnProperty(body, 'restore');

export const isAdministrateUserBody = (body: unknown): body is AdministrateUserBody =>
  hasAdministrateUserBodyFields(body) && (isString(body.rights) || isBoolean(body.restore));