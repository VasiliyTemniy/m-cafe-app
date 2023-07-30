import { hasOwnProperty, isNumber, isString } from '@m-cafe-app/utils';
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
  hasOwnProperty(req, "userId") && hasOwnProperty(req, "token");

export const isRequestCustom = (req: Request): req is RequestCustom =>
  hasRequestCustomFields(req) && isNumber(req.userId) && isString(req.token);

interface RequestWithUserFields extends RequestCustom {
  user: unknown;
}

export interface RequestWithUser extends RequestCustom {
  user: User;
}

export const hasRequestWithUserFields = (req: Request): req is RequestWithUserFields =>
  hasOwnProperty(req, "userId") && hasOwnProperty(req, "token") && hasOwnProperty(req, "user");

export const isRequestWithUser = (req: Request): req is RequestWithUser =>
  hasRequestWithUserFields(req) && isNumber(req.userId) && isString(req.token) && req.user instanceof User;