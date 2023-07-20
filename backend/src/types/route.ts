import { Request, Response, NextFunction } from 'express';
import { User } from '../models/index.js';

export interface RequestCustom extends Request {
  userId?: string;
  token?: string;
  user?: User;
}

export const isCustomRequest = (req: Request): req is RequestCustom =>
Object.prototype.hasOwnProperty.call(req, "userId")
&&
Object.prototype.hasOwnProperty.call(req, "token");

export type Route = (req: RequestCustom, res: Response, next: NextFunction) => void;