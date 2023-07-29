import { isNumber, isString } from '@m-cafe-app/utils';
import { Request } from 'express';
import { User } from '../models/index.js';

export interface RequestMiddle extends Request {
  userId?: number;
  token?: string;
  user?: User;
}

interface RequestCustomFields extends Request {
  userId: unknown;
  token: unknown;
}

export interface RequestCustom extends Request {
  userId: number;
  token: string;
}

export const hasRequestCustomFields = (req: Request): req is RequestCustomFields =>
  Object.prototype.hasOwnProperty.call(req, "userId")
  &&
  Object.prototype.hasOwnProperty.call(req, "token");

export const isRequestCustom = (req: Request): req is RequestCustom => {
  if (hasRequestCustomFields(req)) {
    if (isNumber(req.userId) && isString(req.token)) return true;
  }
  return false;
};

interface RequestWithUserFields extends RequestCustom {
  user: unknown;
}

export interface RequestWithUser extends RequestCustom {
  user: User;
}

export const hasRequestWithUserFields = (req: Request): req is RequestWithUserFields =>
  Object.prototype.hasOwnProperty.call(req, "userId")
  &&
  Object.prototype.hasOwnProperty.call(req, "token")
  &&
  Object.prototype.hasOwnProperty.call(req, "user");

export const isRequestWithUser = (req: Request): req is RequestWithUser =>
  hasRequestWithUserFields(req) && isNumber(req.userId) && isString(req.token) && req.user instanceof User;