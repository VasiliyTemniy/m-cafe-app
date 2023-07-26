import { isNumber, isString, isUserTransit } from '@m-cafe-app/utils';
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
  user: unknown;
}

export interface RequestCustom extends Request {
  userId: number;
  token: string;
  user: User;
}

export const hasCustomRequestFields = (req: Request): req is RequestCustomFields =>
  Object.prototype.hasOwnProperty.call(req, "userId")
  &&
  Object.prototype.hasOwnProperty.call(req, "token")
  &&
  Object.prototype.hasOwnProperty.call(req, "user");

export const isCustomRequest = (req: Request): req is RequestCustom => {
  if (hasCustomRequestFields(req)) {
    if (isNumber(req.userId) && isString(req.token) && isUserTransit(req.user)) return true;
  }
  return false;
};
