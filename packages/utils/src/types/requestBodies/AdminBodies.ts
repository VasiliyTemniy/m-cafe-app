import { hasOwnProperty } from '../helpers.js';
import { isBoolean, isString } from '../typeValidators.js';

export interface AdministrateUserBody {
  rights?: string;
  restore?: boolean;
}

const hasAdministrateUserBodyFields = (obj: unknown): obj is { rights: unknown, restore: unknown; } =>
  hasOwnProperty(obj, 'rights') || hasOwnProperty(obj, 'restore');

export const isAdministrateUserBody = (obj: unknown): obj is AdministrateUserBody =>
  hasAdministrateUserBodyFields(obj) && (isString(obj.rights) || isBoolean(obj.restore));