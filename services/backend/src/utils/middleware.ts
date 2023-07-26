import logger from './logger.js';
import jwt from 'jsonwebtoken';
import config from './config.js';
import { RequestMiddle } from '../types/RequestCustom.js';
import type { RequestHandler } from "express";
import { Request, Response, NextFunction } from 'express';
import { isCustomPayload } from '../types/JWTPayloadCustom.js';
import { AuthorizationError, DatabaseError, SessionError } from '@m-cafe-app/utils';
import { User, Session } from '../models/index.js';

const requestLogger: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  logger.info('Method:' + req.method);
  logger.info('Path:  ' + req.path);
  logger.info('Body:  ' + req.body);
  logger.info('---');
  next();
};


const verifyToken: RequestHandler = (req: RequestMiddle, res: Response, next: NextFunction) => {

  const authorization = req.get('authorization');
  const token =
    authorization && authorization.toLowerCase().startsWith('bearer ')
      ? authorization.substring(7)
      : null;

  if (!req.headers.authorization || !token) return next(new AuthorizationError('Authorization required'));

  req.token = token;

  const payload = jwt.verify(token, config.SECRET);

  if (typeof payload === "string" || payload instanceof String || !isCustomPayload(payload))
    return next(new AuthorizationError('Malformed token'));

  req.userId = Number(payload.id);

  next();
};


const userExtractor = (async (req: RequestMiddle, res: Response, next: NextFunction) => {

  const user = await User.findByPk(req.userId);

  if (!user) return next(new DatabaseError(`No user entry with this id ${req.userId}`));

  req.user = user;

  next();

}) as RequestHandler;


const sessionCheck = (async (req: RequestMiddle, res: Response, next: NextFunction) => {

  const session = await Session.findOne({
    where: {
      userId: req.userId,
      token: req.token
    }
  });

  if (!session) return next(new SessionError('Inactive session. Please, login'));

  next();

}) as RequestHandler;


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
  sessionCheck,
  unknownEndpoint
};