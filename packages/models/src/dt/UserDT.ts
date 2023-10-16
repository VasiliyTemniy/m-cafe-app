import type { MapToDT, MapToDTN, PropertyGroup } from '@m-cafe-app/utils';
import type { User } from '../domain';
import {
  isString,
  hasOwnProperty,
  ApplicationError,
  isEntity,
  isUnknownObject,
  isBoolean
} from '@m-cafe-app/utils';
import { idRequired, passwordRequired } from './validationHelpers.js';


const userDTPropertiesGroups: PropertyGroup[] = [{
  properties: ['phonenumber'],
  validator: isString,
}, {
  properties: ['username', 'name', 'email', 'rights', 'birthdate'],
  required: false,
  validator: isString,
}];

export type UserDT = Omit<MapToDT<User>, 'lookupHash' | 'lookupNoise'>;

/**
 * Checks if the given object is of type UserDT. Throws an error if it has passwordHash.
 */
export const isUserDT = (obj: unknown): obj is UserDT => {
  if (hasOwnProperty(obj, 'passwordHash')) throw new ApplicationError('User data transit passwordHash detected! Please, contact admins');

  return isEntity(obj, [ idRequired, ...userDTPropertiesGroups ]);
};


const userDTNUPropertiesGroups: PropertyGroup[] = [{
  properties: ['phonenumber'],
  validator: isString,
}, {
  properties: ['username', 'name', 'email', 'birthdate'],
  required: false,
  validator: isString,
}];

export type UserDTN = Omit<MapToDTN<User>, 'lookupHash' | 'lookupNoise' | 'rights'> & {
  password: string;
};

/**
 * Checks if the given object is of type UserDT New or Update. Throws an error if it has passwordHash.
 */
export const isUserDTN = (obj: unknown): obj is UserDTN => {
  if (hasOwnProperty(obj, 'passwordHash')) throw new ApplicationError('User data transit passwordHash detected! Please, contact admins');

  return isEntity(obj, [ passwordRequired, ...userDTNUPropertiesGroups ]);
};



const newPasswordOptional: PropertyGroup = {
  properties: ['newPassword'],
  required: false,
  validator: isString,
};

export type UserDTU = Omit<MapToDT<User>, 'lookupHash' | 'lookupNoise' | 'rights'> & {
  password: string;
  newPassword?: string;
};

export const isUserDTU = (obj: unknown): obj is UserDTU => {
  if (hasOwnProperty(obj, 'passwordHash')) throw new ApplicationError('User data transit passwordHash detected! Please, contact admins');

  return isEntity(obj, [ passwordRequired, newPasswordOptional, ...userDTNUPropertiesGroups ]);
};


export type UserLoginDT = {
  phonenumber?: string;
  username?: string;
  email?: string;
  password: string;
};

export const isUserLoginDT = (obj: unknown): obj is UserLoginDT => {
  if (!isUnknownObject(obj)) return false;

  if (!hasOwnProperty(obj, 'password')) return false;

  if (hasOwnProperty(obj, 'phonenumber') && isString(obj.phonenumber)) return true;
  if (hasOwnProperty(obj, 'username') && isString(obj.username)) return true;
  if (hasOwnProperty(obj, 'email') && isString(obj.email)) return true;

  return false;
};


export interface AdministrateUserBody {
  rights?: string;
  restore?: boolean;
}

export const isAdministrateUserBody = (obj: unknown): obj is AdministrateUserBody => {
  if (!isUnknownObject(obj)) return false;
  if (!hasOwnProperty(obj, 'rights') && !hasOwnProperty(obj, 'restore')) return false;
  if (hasOwnProperty(obj, 'rights') && !isString(obj.rights)) return false;
  if (hasOwnProperty(obj, 'restore') && !isBoolean(obj.restore)) return false;
  return true;
};