import type { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import type { JwtPayloadCustom } from '../types/JWTPayloadCustom.js';
import { logger } from '@m-cafe-app/utils';
import { Session } from '../redis/Session.js';
import { hasOwnProperty, isCustomError, isNamedError } from '@m-cafe-app/utils';
import jwt from 'jsonwebtoken';
import { AggregateError as SequelizeAggregateError } from 'sequelize';

export const errorHandler = (async (error, req: Request, res: Response, next: NextFunction) => {

  /**
   * SEQUELIZE AGGREGATE ERROR START
   */

  if (error instanceof SequelizeAggregateError) {
    res.status(400).json({
      error: {
        name: 'SequelizeAggregateError',
        message: error.message,
        errors: error.errors
      }
    });
    return next(error);
  }

  /**
   * SEQUELIZE AGGREGATE ERROR END
   */



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
        message: 'Some internal DB constraints error or Sequelize error',
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
      res.status(401).json({
        error: {
          name: 'JsonWebTokenError',
          message: 'Invalid token'
        }
      });
      return next(error);

    case 'TokenExpiredError':

      const hasToken = (req: unknown): req is { token: unknown; } => hasOwnProperty(req, 'token');
      if (!hasToken(req)) {
        res.status(401).json({
          error: {
            name: 'UnknownError',
            message: 'Token was not found in auth header, but TokenExpiredError called = this should not be reached'
          }
        });
        return next(error);
      }

      const token = req.token as string;
      const payload = jwt.decode(token) as JwtPayloadCustom;
      const userAgent = req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown';

      await Session.destroy({
        where: {
          userId: Number(payload.id),
          token,
          userAgent
        }
      });

      res.status(401).json({
        error: {
          name: 'TokenExpiredError',
          message: 'Token expired. Please, relogin'
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

  // ADD NEW ERRORS HANDLING HERE !!!

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

    case 'UploadFileError':
      res.status(400).json({
        error: {
          name: 'UploadFileError',
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

    case 'RequestQueryError':
      res.status(400).json({
        error: {
          name: 'RequestQueryError',
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

    case 'ParseError':
      res.status(400).json({
        error: {
          name: 'ParseError',
          message: error.message
        }
      });
      break;

    case 'RedisError':
      res.status(500).json({
        error: {
          name: 'RedisError',
          message: error.message
        }
      });
      break;

    case 'ApplicationError':
      res.status(500).json({
        error: {
          name: 'ApplicationError',
          message: error.message
        }
      });
      break;


    default:
      logger.shout('This should not be reached', error);
      res.status(500).json({
        error: {
          name: 'UnhandledError',
          message: 'UNHANDLED error!',
          originalError: error
        }
      });
      return next(error);

  }

  /**
   * CUSTOM ERRORS END
   */

  next(error);
}) as ErrorRequestHandler;