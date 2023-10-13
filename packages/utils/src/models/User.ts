import type { MapToDT } from '../types/helpers.js';
import type { UserData } from '@m-cafe-app/db';
import { checkProperties, isNumber, isString } from '../types/typeValidators.js';
import { hasOwnProperty } from '../types/helpers.js';
import { ApplicationError } from '../types/Errors.js';


export type UserDT = Omit<MapToDT<UserData>, 'passwordHash'>;

export const isUserDT = (obj: unknown): obj is UserDT => {

  if (hasOwnProperty(obj, 'passwordHash')) throw new ApplicationError('User data transit passwordHash detected! Please, contact admins');

  if (!checkProperties({ obj, properties: [
    'id'
  ], required: true, validator: isNumber })) return false;

  if (!checkProperties({ obj, properties: [
    'phonenumber'
  ], required: true, validator: isString })) return false;

  if (!checkProperties({ obj, properties: [
    'username', 'name', 'email', 'birthdate', 'rights'
  ], required: false, validator: isString })) return false;

  return true;
};