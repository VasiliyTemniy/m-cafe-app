import { Request } from 'express';
import { User } from '../models/index.js';

export interface RequestMiddle extends Request {
  userId?: string;
  token?: string;
  user?: User;
}
export interface RequestCustom extends Request {
  userId: string;
  token: string;
  user: User;
}

export const isCustomRequest = (req: Request): req is RequestCustom =>
  Object.prototype.hasOwnProperty.call(req, "userId")
  &&
  Object.prototype.hasOwnProperty.call(req, "token")
  &&
  Object.prototype.hasOwnProperty.call(req, "user");