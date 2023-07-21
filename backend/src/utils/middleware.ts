import logger from './logger.js';
import jwt from 'jsonwebtoken';
import config from './config.js';
import { isCustomRequest, RequestMiddle } from '../types/route.js';
import type { ErrorRequestHandler, RequestHandler } from "express";
import { Request, Response, NextFunction } from 'express';
import { isCustomPayload } from '../types/token.js';
import { AuthorizationError, DatabaseError, SessionError } from '../types/errors.js';
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

  const payload = jwt.verify(token, config.SECRET);

  if (typeof payload === "string" || payload instanceof String || !isCustomPayload(payload))
    return next(new AuthorizationError('Malformed token'));
    
  req.userId = payload.id;
  req.token = token;
  
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


// REWRITE MEEEEEEEE
// REWRITE MEEEEEEEE
// REWRITE MEEEEEEEE
const errorHandler = (async (error, req: Request, res: Response, next: NextFunction) => {

  logger.error(error.message as string);

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message as string });
  } else if (error.name === 'RequestBodyError') {
    return res.status(400).json({ error: error.message as string });
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token' });
  } else if (error.name === 'TokenExpiredError') {
    if (isCustomRequest(req))
    await Session.destroy({
      where: {
        userId: req.userId,
        token: req.token
      }
    });
    return res.status(401).json({ error: 'Token expired' });
  } else if (error.name === 'SessionError') {
    return res.status(401).json(error);
  } else if (error.name === 'SequelizeValidationError') {
    if (error.message === 'Validation error: Validation isEmail on username failed') {
      return res.status(400).json({ error: 'Validation isEmail on username failed' });
    } else if (error.message === 'notNull Violation: blog.year cannot be null') {
      return res.status(400).json({ error: 'Specify blog creation year' });
    } else if (error.message === 'Validation error: Validation min on year failed' || error.message === 'Validation error: Validation max on year failed') {
      return res.status(400).json({ error: 'Invalid year' });
    } else {
      return res.status(400).json({ error: 'Validation error' });
    }
  } else if (error.message === 'No blog entry') {
    return res.status(404).send({ error: 'Invalid blog id' });
  } else if (error.message === 'No user entry') {
    return res.status(404).send({ error: 'Invalid user id' });
  }
  next(error);
}) as ErrorRequestHandler;


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
  errorHandler,
  unknownEndpoint
};