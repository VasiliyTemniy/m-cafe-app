import logger from './logger.js';
import jwt from 'jsonwebtoken';
import config from './config.js';
import models from '../models/index.js';
import { Route, isCustomRequest } from '../types/route.js';
import type { ErrorRequestHandler } from "express";
import { Request, Response } from 'express';
import { isCustomPayload } from '../types/token.js';
import { SessionError } from '../types/errors.js';

const { User, Session } = models;

const requestLogger : Route = (req, res, next) => {
  logger.info('Method:' + req.method);
  logger.info('Path:  ' + req.path);
  logger.info('Body:  ' + req.body);
  logger.info('---');
  next();
};

const verifyToken : Route = (req, res, next) => {
  const authorization = req.get('authorization');
  const token =
    authorization && authorization.toLowerCase().startsWith('bearer ')
      ? authorization.substring(7)
      : null;

  if (!req.headers.authorization) {
    return res.status(401).json({ error: 'Authorization required' });
  }

  if (token) {

    const payload = jwt.verify(token, config.SECRET);
    
    if (typeof payload === "object" && isCustomPayload(payload)) {
      req.userId = payload.id;
    } else {
      return res.status(401).json({ error: 'token invalid' });
    }
    req.token = token;

  } else {
    return res.status(401).json({ error: 'token missing' });
  }
  
  next();
};

// const userExtractor : Route = async (req, res, next) => {
//   const user = await User.findByPk(req.userId);
//   if (user) req.user = user;
//   next();
// };

const userExtractor : Route = (req, res, next) => {
  (async () => {
    const user = await User.findByPk(req.userId);
    if (user) req.user = user;
    next();
  });
};

const sessionCheck : Route = (req, res, next) => {
  (async () => {
    const session = await Session.findOne({
      where: {
        userId: req.userId,
        token: req.token
      }
    });
  
    if (!session) {
      next(new SessionError('Inactive session. Please, login'));
    }
  
    next();
  });
};

const errorHandler: ErrorRequestHandler = (async (error, req, res, next) => {

  logger.error(error.message as string);

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message as string });
  } else if (error.name === 'RequestBodyError') {
    return res.status(400).json(error);
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

const unknownEndpoint = (req: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

export default {
  requestLogger,
  verifyToken,
  userExtractor,
  sessionCheck,
  errorHandler,
  unknownEndpoint
};