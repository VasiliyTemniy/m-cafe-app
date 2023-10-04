import type { MapToDT, MapToDTN } from '@m-cafe-app/utils';
import type { User } from '../domain';
import {
  isString,
  hasOwnProperty,
  ApplicationError,
  isEntity,
  idRequired,
  passwordRequired
} from '@m-cafe-app/utils';


const userDTPropertiesGroups = [{
  properties: ['phonenumber'],
  required: true,
  validator: isString,
  isArray: false
}, {
  properties: ['username', 'name', 'email', 'rights', 'birthdate'],
  required: false,
  validator: isString,
  isArray: false
}];


export type UserDT = Omit<MapToDT<User>, 'password'>;

/**
 * Checks if the given object is of type UserDT. Throws an error if it has passwordHash.
 */
export const isUserDT = (obj: unknown): obj is UserDT => {
  if (hasOwnProperty(obj, 'passwordHash')) throw new ApplicationError('User data transit passwordHash detected! Please, contact admins');

  return isEntity(obj, [ idRequired, ...userDTPropertiesGroups ]);
};


const newPasswordOptional = {
  properties: ['newPassword'],
  required: false,
  validator: isString,
  isArray: false
};

export type UserDTN = MapToDTN<User> & {
  password: string;
  newPassword?: string;
};

/**
 * Checks if the given object is of type UserDT New or Update. Throws an error if it has passwordHash.
 */
export const isUserDTN = (obj: unknown): obj is UserDTN => {
  if (hasOwnProperty(obj, 'passwordHash')) throw new ApplicationError('User data transit passwordHash detected! Please, contact admins');

  return isEntity(obj, [ passwordRequired, newPasswordOptional, ...userDTPropertiesGroups ]);
};