import type { Request } from 'express';
import { checkProperties, hasOwnProperty, isNumber, isString } from '@m-cafe-app/utils';
import { User } from '@m-cafe-app/db';

export interface RequestMiddle extends Request {
  userId?: number;
  token?: string;
  user?: User;
  rights?: string;
  verifyOptional?: boolean;
}

export interface RequestCustom extends Request {
  userId: number;
  token: string;
}

export const isRequestCustom = (req: Request): req is RequestCustom => {
  if (!checkProperties({obj: req, properties: [
    'token'
  ], required: true, validator: isString})) return false;

  if (!checkProperties({obj: req, properties: [
    'userId'
  ], required: true, validator: isNumber})) return false;

  return true;
};

interface RequestWithUserFields extends RequestCustom {
  user: unknown;
}

export interface RequestWithUser extends RequestCustom {
  user: User;
}

export const hasRequestWithUserFields = (req: Request): req is RequestWithUserFields =>
  hasOwnProperty(req, 'userId') && hasOwnProperty(req, 'token') && hasOwnProperty(req, 'user');

export const isRequestWithUser = (req: Request): req is RequestWithUser =>
  hasRequestWithUserFields(req) && isNumber(req.userId) && isString(req.token) && req.user instanceof User;


interface RequestWithUserRights extends Request {
  rights: string;
}

export const isRequestWithUserRights = (req: Request): req is RequestWithUserRights => {
  if (!checkProperties({obj: req, properties: [
    'rights'
  ], required: true, validator: isString})) return false;

  return true;
};