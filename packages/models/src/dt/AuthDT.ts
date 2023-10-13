import type { MapToDT, PropertyGroup } from '@m-cafe-app/utils';
import type { AuthRequest, AuthResponse, CredentialsRequest, VerifyResponse } from '../domain';
import { isEntity, isString, isBoolean } from '@m-cafe-app/utils';
import { idRequired } from './validationHelpers';


export type AuthDTRequest = Omit<MapToDT<AuthRequest>, 'newPassword' | 'oldPassword'> & {
  password: string
};

const authDTRequestPropertiesGroup: PropertyGroup = {
  properties: ['password', 'lookupHash'],
  validator: isString,
};

export const isAuthDTRequest = (obj: unknown): obj is AuthDTRequest => 
  isEntity(obj, [idRequired, authDTRequestPropertiesGroup]);


export type AuthDTURequest = Omit<MapToDT<AuthRequest>, 'password'> & {
  oldPassword: string,
  newPassword: string
};

const authDTURequestPropertiesGroup: PropertyGroup = {
  properties: ['oldPassword', 'newPassword', 'lookupHash'],
  validator: isString,
};

export const isAuthDTURequest = (obj: unknown): obj is AuthDTURequest => 
  isEntity(obj, [idRequired, authDTURequestPropertiesGroup]);


export type CredentialsDTRequest = MapToDT<CredentialsRequest>;

export const isCredentialsDTRequest = (obj: unknown): obj is CredentialsDTRequest =>
  isEntity(obj, [authDTRequestPropertiesGroup]);


export type AuthDTResponse = MapToDT<AuthResponse>;

const authDTResponsePropertiesGroup: PropertyGroup = {
  properties: ['id', 'token', 'error'], // id comes as string because of grpc-js
  validator: isString,
};

export const isAuthDTResponse = (obj: unknown): obj is AuthDTResponse =>
  isEntity(obj, [authDTResponsePropertiesGroup]);


export type VerifyDTResponse = MapToDT<VerifyResponse>;

const verifyDTResponsePropertiesGroups: PropertyGroup[] = [{
  properties: ['error'],
  validator: isString,
}, {
  properties: ['success'],
  validator: isBoolean,
}];

export const isVerifyDTResponse = (obj: unknown): obj is VerifyDTResponse =>
  isEntity(obj, verifyDTResponsePropertiesGroups);