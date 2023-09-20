import type { RequestMiddle } from '../types/RequestCustom.js';
import type { RequestHandler, Request, Response, NextFunction } from 'express';
import logger from './logger.js';
import jwt from 'jsonwebtoken';
import config from './config.js';
import { isCustomPayload } from '../types/JWTPayloadCustom.js';
import {
  ApplicationError,
  AuthorizationError,
  BannedError,
  DatabaseError,
  ProhibitedError,
  RequestQueryError,
  SessionError
} from '@m-cafe-app/utils';
import { User } from '@m-cafe-app/db';
import { Session } from '../redis/Session.js';

const requestLogger: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Method:' + req.method);
  logger.info('Path:  ' + req.path);
  logger.info('Body:  ' + req.body);
  logger.info('---');
  next();
};


const verifyToken: RequestHandler = (req: RequestMiddle, res: Response, next: NextFunction) => {

  if (!req.cookies.token) return next(new AuthorizationError('Authorization required'));

  const token = req.cookies.token as string;

  req.token = token;

  const payload = jwt.verify(token, config.SECRET);

  if (typeof payload === "string" || payload instanceof String || !isCustomPayload(payload))
    return next(new AuthorizationError('Malformed token'));

  req.userId = Number(payload.id);

  next();
};


const userExtractor = (async (req: RequestMiddle, res: Response, next: NextFunction) => {

  const user = await User.scope('all').findByPk(req.userId, { paranoid: false });

  if (!user) return next(new DatabaseError(`No user entry with this id ${req.userId}`));
  if (user.rights === 'disabled') return next(new BannedError('Your account have been banned. Contact admin to unblock account'));
  if (user.deletedAt) return next(new ProhibitedError('You have deleted your own account. To delete it permanently or restore it, contact admin'));

  req.user = user;

  next();

}) as RequestHandler;


const userCheck = (async (req: RequestMiddle, res: Response, next: NextFunction) => {

  if (!req.token) return next(new ApplicationError('Wrong usage of a userCheck middleware in app code. Please, contact admins'));

  const userRights = await Session.getUserRightsCache(req.token);
  if (userRights === 'disabled') return next(new BannedError('Your account have been banned. Contact admin to unblock account'));

  next();

}) as RequestHandler;


const managerCheck = (async (req: RequestMiddle, res: Response, next: NextFunction) => {

  if (!req.token) return next(new ApplicationError('Wrong usage of a managerCheck middleware in app code. Please, contact admins'));

  const userRights = await Session.getUserRightsCache(req.token);
  if (!(userRights === 'manager' || userRights === 'admin')) return next(new ProhibitedError('You have no manager permissions'));

  next();

}) as RequestHandler;


const adminCheck = (async (req: RequestMiddle, res: Response, next: NextFunction) => {

  if (!req.token) return next(new ApplicationError('Wrong usage of a adminCheck middleware in app code. Please, contact admins'));

  const userRights = await Session.getUserRightsCache(req.token);
  if (userRights !== 'admin') return next(new ProhibitedError('You have no admin permissions'));

  next();

}) as RequestHandler;


const sessionCheck = (async (req: RequestMiddle, res: Response, next: NextFunction) => {

  if (!req.userId) return next(new ApplicationError('Wrong usage of a sessionCheck middleware in app code. Please, contact admins'));

  const userAgent = req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown';

  const session = await Session.findOne({
    where: {
      userId: req.userId,
      userAgent
    }
  });

  if (!session) return next(new SessionError('Inactive session. Please, login'));

  next();

}) as RequestHandler;


const requestParamsCheck = (req: RequestMiddle, res: Response, next: NextFunction) => {

  if (!req.params) return next();

  for (const paramKey in req.params)
    if (paramKey.toLowerCase().endsWith('id') && isNaN(Number(req.params[paramKey])))
      return next(new RequestQueryError('Request params malformed'));

  next();

};


const unknownEndpoint: RequestHandler = (req: Request, res: Response) => {
  res.status(404).json({
    error: {
      name: 'UnknownEndpoint',
      message: 'UnknownEndpoint'
    }
  });
};

export default {
  requestLogger,
  verifyToken,
  userExtractor,
  userCheck,
  managerCheck,
  adminCheck,
  sessionCheck,
  requestParamsCheck,
  unknownEndpoint
};