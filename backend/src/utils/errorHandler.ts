import logger from './logger.js';
import { isCustomRequest } from '../types/route.js';
import type { ErrorRequestHandler } from "express";
import { Request, Response, NextFunction } from 'express';
import { Session } from '../models/index.js';
import { isCustomError } from '../types/errors.js';

export const errorHandler = (async (error, req: Request, res: Response, next: NextFunction) => {

  if (!isCustomError(error)) {
    logger.shout('This error has either no name or no message, take measures!');
    logger.info(error as string);
    return next(error);
  }

  logger.error([error.name, error.message]);

  switch (error.name) {

    case 'CastError':
      res.status(400).json({
        error: {
          name: 'CastError',
          message: 'Malformatted id'
        }
      });
      break;

    case 'ValidationError':
      res.status(400).json({
        error: {
          name: 'ValidationError',
          message: error.message
        }
      });
      break;

    case 'JsonWebTokenError':
      res.status(400).json({
        error: {
          name: 'JsonWebTokenError',
          message: 'Invalid token'
        }
      });
      break;

    case 'TokenExpiredError':
      if (isCustomRequest(req))
      await Session.destroy({
        where: {
          userId: req.userId,
          token: req.token
        }
      });
      res.status(400).json({
        error: {
          name: 'TokenExpiredError',
          message: 'Token expired'
        }
      });
      break;

    case 'SequelizeValidationError':
      res.status(400).json({
        error: {
          name: 'SequelizeValidationError',
          message: error.message
        }
      });
      break;

    case 'SessionError':
        res.status(400).json({
          error: {
            name: 'SessionError',
            message: error.message
          }
        });
        break;

    case 'RequestBodyError':
        res.status(400).json({
          error: {
            name: 'RequestBodyError',
            message: error.message
          }
        });
        break;

    case 'CredentialsError':
      res.status(400).json({
        error: {
          name: 'CredentialsError',
          message: error.message
        }
      });
      break;

    case 'BannedError':
      res.status(400).json({
        error: {
          name: 'BannedError',
          message: error.message
        }
      });
      break;

    case 'HackError':
      res.status(400).json({
        error: {
          name: 'HackError',
          message: error.message
        }
      });
      break;

    case 'PasswordLengthError':
      res.status(400).json({
        error: {
          name: 'PasswordLengthError',
          message: error.message
        }
      });
      break;

    case 'UnknownError':
      res.status(400).json({
        error: {
          name: 'UnknownError',
          message: error.message
        }
      });
      break;

    case 'DatabaseError':
      res.status(400).json({
        error: {
          name: 'DatabaseError',
          message: error.message
        }
      });
      break;

    case 'ProhibitedError':
      res.status(400).json({
        error: {
          name: 'ProhibitedError',
          message: error.message
        }
      });
      break;

    case 'AuthorizationError':
      res.status(400).json({
        error: {
          name: 'AuthorizationError',
          message: error.message
        }
      });
      break;

  }

  next(error);
}) as ErrorRequestHandler;