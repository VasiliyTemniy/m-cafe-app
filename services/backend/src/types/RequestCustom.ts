import { isNumber, isString } from '@m-cafe-app/utils';
import { Request } from 'express';

export interface RequestMiddle extends Request {
  userId?: number;
  token?: string;
}

interface RequestCustomFields extends Request {
  userId: unknown;
  token: unknown;
}

export interface RequestCustom extends Request {
  userId: number;
  token: string;
}

export const hasCustomRequestFields = (req: Request): req is RequestCustomFields =>
  Object.prototype.hasOwnProperty.call(req, "userId")
  &&
  Object.prototype.hasOwnProperty.call(req, "token");

export const isCustomRequest = (req: Request): req is RequestCustom => {
  if (hasCustomRequestFields(req)) {
    if (isNumber(req.userId) && isString(req.token)) return true;
  }
  return false;
};
