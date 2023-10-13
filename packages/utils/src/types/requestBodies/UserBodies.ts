import type { UserDT } from '../../models/User.js';
import { checkProperties, isString } from '../typeValidators.js';


export type NewUserBody = Omit<UserDT, 'rights' | 'id'> & { password: string; };

export const isNewUserBody = (obj: unknown): obj is NewUserBody => {

  if (!checkProperties({ obj, properties: [
    'phonenumber', 'password'
  ], required: true, validator: isString })) return false;

  if (!checkProperties({ obj, properties: [
    'username', 'name', 'email', 'birthdate', 'rights'
  ], required: false, validator: isString })) return false;

  return true;
};


export interface EditUserBody extends Omit<NewUserBody, 'phonenumber'> {
  newPassword?: string;
  phonenumber?: string;
}

export const isEditUserBody = (obj: unknown): obj is EditUserBody => {

  if (!checkProperties({ obj, properties: [
    'password'
  ], required: true, validator: isString })) return false;

  if (!checkProperties({ obj, properties: [
    'username', 'name', 'email', 'birthdate', 'rights', 'newPassword', 'phonenumber'
  ], required: false, validator: isString })) return false;

  return true;
};