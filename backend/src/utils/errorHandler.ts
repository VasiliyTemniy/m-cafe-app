import logger from './logger.js';
import { isCustomRequest } from '../types/RequestCustom.js';
import type { ErrorRequestHandler } from "express";
import { Request, Response, NextFunction } from 'express';
import { Session } from '../models/index.js';
import { isCustomError, isNamedError } from '../types/Errors.js';

export const errorHandler = (async (error, req: Request, res: Response, next: NextFunction) => {

  if (!isNamedError(error)) {
    logger.shout('This error has no name, take measures!', error);
    res.status(500).json({
      error: {
        name: 'UnhandledError',
        message: 'UNHANDLED error!'
      }
    });
    return next(error);
  }

  logger.error(error);

  /**
   * SEQUELIZE ERRORS START
   */

  if (error.name.startsWith('Sequelize')) {
    const status = error.name === 'SequelizeUniqueConstraintError' ? 409 : 400;
    res.status(status).json({
      error: {
        name: error.name,
        message: 'Some internal constraints error',
        originalError: { ...error }
      }
    });
    return next(error);
  }

  /**
   * SEQUELIZE ERRORS END
   */

  /**
   * OTHER LIBS ERRORS
   */

  switch (error.name) {

    case 'JsonWebTokenError':
      res.status(400).json({
        error: {
          name: 'JsonWebTokenError',
          message: 'Invalid token'
        }
      });
      return next(error);

    case 'TokenExpiredError':
      if (isCustomRequest(req))
      await Session.destroy({
        where: {
          userId: req.userId,
          token: req.token
        }
      });
      res.status(401).json({
        error: {
          name: 'TokenExpiredError',
          message: 'Token expired'
        }
      });
      return next(error);

  }

  /**
   * OTHER LIBS ERRORS END
   */

  /**
   * CUSTOM ERRORS
   */

  if (!isCustomError(error)) {
    logger.shout('This error has no message, take measures!', error);
    res.status(500).json({
      error: {
        name: 'UnhandledError',
        message: 'UNHANDLED error!'
      }
    });
    return next(error);
  }

  switch (error.name) {

    case 'SessionError':
      res.status(401).json({
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
      res.status(401).json({
        error: {
          name: 'CredentialsError',
          message: error.message
        }
      });
      break;

    case 'BannedError':
      res.status(403).json({
        error: {
          name: 'BannedError',
          message: error.message
        }
      });
      break;

    case 'HackError':
      res.status(418).json({
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
      res.status(520).json({
        error: {
          name: 'UnknownError',
          message: error.message
        }
      });
      break;

    case 'DatabaseError':
      res.status(404).json({
        error: {
          name: 'DatabaseError',
          message: error.message
        }
      });
      break;

    case 'ProhibitedError':
      res.status(403).json({
        error: {
          name: 'ProhibitedError',
          message: error.message
        }
      });
      break;

    case 'AuthorizationError':
      res.status(401).json({
        error: {
          name: 'AuthorizationError',
          message: error.message
        }
      });
      break;

    default:
      logger.shout('This should not be reached');
      res.status(500).json({
        error: {
          name: 'UnhandledError',
          message: 'UNHANDLED error!'
        }
      });
      return next(error);

  }

  /**
   * CUSTOM ERRORS END
   */

  next(error);
}) as ErrorRequestHandler;