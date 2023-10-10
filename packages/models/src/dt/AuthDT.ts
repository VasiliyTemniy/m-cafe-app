import type { MapToDT } from '@m-cafe-app/utils';
import type { AuthRequest, AuthResponse, CredentialsRequest, VerifyResponse } from '../domain';
import { isEntity, isString, idRequired, isBoolean } from '@m-cafe-app/utils';


export type AuthDTRequest = Omit<MapToDT<AuthRequest>, 'newPassword' | 'oldPassword'> & {
  password: string
};

const authDTRequestPropertiesGroup = {
  properties: ['password', 'lookupHash'],
  required: true,
  validator: isString,
  isArray: false
};

export const isAuthDTRequest = (obj: unknown): obj is AuthDTRequest => 
  isEntity(obj, [idRequired, authDTRequestPropertiesGroup]);


export type AuthDTURequest = Omit<MapToDT<AuthRequest>, 'password'> & {
  oldPassword: string,
  newPassword: string
};

const authDTURequestPropertiesGroup = {
  properties: ['oldPassword', 'newPassword', 'lookupHash'],
  required: true,
  validator: isString,
  isArray: false
};

export const isAuthDTURequest = (obj: unknown): obj is AuthDTURequest => 
  isEntity(obj, [idRequired, authDTURequestPropertiesGroup]);


export type CredentialsDTRequest = MapToDT<CredentialsRequest>;

export const isCredentialsDTRequest = (obj: unknown): obj is CredentialsDTRequest =>
  isEntity(obj, [authDTRequestPropertiesGroup]);


export type AuthDTResponse = MapToDT<AuthResponse>;

const authDTResponsePropertiesGroup = {
  properties: ['id', 'token', 'error'], // id comes as string because of grpc-js
  required: true,
  validator: isString,
  isArray: false
};

export const isAuthDTResponse = (obj: unknown): obj is AuthDTResponse =>
  isEntity(obj, [authDTResponsePropertiesGroup]);


export type VerifyDTResponse = MapToDT<VerifyResponse>;

const verifyDTResponsePropertiesGroups = [{
  properties: ['error'],
  required: true,
  validator: isString,
  isArray: false
}, {
  properties: ['success'],
  required: true,
  validator: isBoolean,
  isArray: false
}];

export const isVerifyDTResponse = (obj: unknown): obj is VerifyDTResponse =>
  isEntity(obj, verifyDTResponsePropertiesGroups);