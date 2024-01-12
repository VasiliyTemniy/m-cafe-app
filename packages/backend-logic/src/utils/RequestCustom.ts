import type { Request } from 'express';
import { checkProperties, isNumber, isString } from '@m-market-app/utils';
import { User } from '@m-market-app/models';

export interface RequestMiddle extends Request {
  userId?: number;
  token?: string;
  user?: User;
  rights?: string;
  verifyOptional?: boolean;
  userAgent?: string;
}

export interface RequestCustom extends Request {
  userId: number;
  token: string;
  rights: string;
}

export const isRequestCustom = (req: Request): req is RequestCustom => {
  if (!checkProperties({ obj: req, properties: [
    'token'
  ], required: true, validator: isString })) return false;

  if (!checkProperties({ obj: req, properties: [
    'userId'
  ], required: true, validator: isNumber })) return false;

  if (!checkProperties({ obj: req, properties: [
    'rights'
  ], required: true, validator: isString })) return false;

  return true;
};

export interface RequestWithUserRights extends Request {
  rights: string;
}

export const isRequestWithUserRights = (req: Request): req is RequestWithUserRights => {
  if (!checkProperties({ obj: req, properties: [
    'rights'
  ], required: true, validator: isString })) return false;

  return true;
};