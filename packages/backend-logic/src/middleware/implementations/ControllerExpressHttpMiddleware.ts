import type { Request, Response, NextFunction } from 'express';
import type { IControllerExpressHttpMiddleware } from '../interfaces';
import type { RequestMiddle } from '../../utils';
import type { IAuthController } from '../../models/Auth';
import type { IUserRepo } from '../../models/User';
import type { ISessionService } from '../../models/Session';
import { ApplicationError, AuthorizationError, BannedError, ProhibitedError, RequestQueryError, logger } from '@m-cafe-app/utils';
import config from '../../config';


export class ControllerExpressHttpMiddleware implements IControllerExpressHttpMiddleware {
  constructor (
    readonly userRepo: IUserRepo,
    readonly sessionService: ISessionService,
    readonly authController: IAuthController,
  ) {}

  requestLogger(req: Request, res: Response, next: NextFunction): void {
    logger.info('Method:' + req.method);
    logger.info('Path:  ' + req.path);
    logger.info('Body:  ' + req.body);
    logger.info('---');
    next();
  }

  /**
   * Used for cases like food order: it can be done with or without authorization\
   * Middleware prerequisites: no
   */
  setVerifyOptional(req: RequestMiddle, res: Response, next: NextFunction): void {
    req.verifyOptional = true;
    next();
  }

  /**
   * Verifies token in cookies\
   * Adds token, userAgent, userId to request properties\
   * Middleware prerequisites: no
   */
  verifyToken(req: RequestMiddle, res: Response, next: NextFunction): void {

    if (!req.cookies.token)
      if (!req.verifyOptional) return next(new AuthorizationError('Authorization required'));
      else return next();

    const token = req.cookies.token as string;

    req.token = token;

    const { id, token: _token, error } = this.authController.verifyTokenInternal({ token });

    if (error)
      return next(new AuthorizationError(error));

    // Extract userAgent from headers as part of a Session identity;
    // Add userAgent and userId to request for further usage
    req.userAgent = req.headers['user-agent'] ? req.headers['user-agent'] : 'unknown';
    req.userId = id;

    next();
  }

  /**
   * Adds user model instance to request\
   * Middleware prerequisites: verifyToken
   */
  async userExtractor(req: RequestMiddle, res: Response, next: NextFunction): Promise<void> {
    if (!req.userId) return next(new ApplicationError('Wrong middleware usage - userExtractor: userId undefined; use verifyToken before userExtractor. Please, contact admins'));

    const user = await this.userRepo.getById(req.userId);

    if (user.rights === 'disabled') return next(new BannedError('Your account have been banned. Contact admin to unblock account'));
    if (user.deletedAt) return next(new ProhibitedError('You have deleted your own account. To delete it permanently or restore it, contact admin'));
  
    req.user = user;
  
    next();
  }

  /**
   * Adds user rights to request\
   * If no userId in request - sets rights to 'customer'\
   * Raises an error if user is banned\
   * Middleware prerequisites: verifyToken, setVerifyOptional
   */
  async userRightsExtractor(req: RequestMiddle, res: Response, next: NextFunction): Promise<void> {

    if (!req.userId || !req.userAgent) {
      req.rights = 'customer';
      return next();
    } 

    const userSession = await this.sessionService.getOne(req.userId, req.userAgent);

    if (!userSession) {
      // Possibly some kind of internal redis\inmem error
      logger.error(`Session not found: ${req.userId}, ${req.userAgent}`);
      return next(new AuthorizationError('Wrong token - userAgent pair. Are you trying to hack me?'));
    }

    if (userSession.rights === 'disabled') return next(new BannedError('Your account have been banned. Contact admin to unblock account'));
  
    req.rights = userSession.rights;
  
    next();
  }

  /**
   * Checks user rights in request\
   * Makes sure that request contains user rights\
   * Middleware prerequisites: verifyToken, setVerifyOptional, userRightsExtractor
   */
  userCheck(req: RequestMiddle, res: Response, next: NextFunction): void {

    if (!req.rights) return next(new ApplicationError('Wrong usage of a userCheck middleware in app code; use userRightsExtractor before userCheck. Please, contact admins'));
  
    next();
  }

  /**
   * Checks user rights in request\
   * Makes sure that user has manager rights\
   * Middleware prerequisites: verifyToken, setVerifyOptional, userRightsExtractor
   */
  managerCheck(req: RequestMiddle, res: Response, next: NextFunction): void {

    if (!req.rights) return next(new ApplicationError('Wrong usage of a managerCheck middleware in app code; use userRightsExtractor before managerCheck. Please, contact admins'));

    if (!(req.rights === 'manager' || req.rights === 'admin')) return next(new ProhibitedError('You have no manager permissions'));

    next();
  }

  /**
   * Checks user rights in request\
   * Makes sure that user has admin rights\
   * Middleware prerequisites: verifyToken, setVerifyOptional, userRightsExtractor
   */
  adminCheck(req: RequestMiddle, res: Response, next: NextFunction): void {

    if (!req.rights) return next(new ApplicationError('Wrong usage of an adminCheck middleware in app code; use userRightsExtractor before adminCheck. Please, contact admins'));

    if (req.rights !== 'admin') return next(new ProhibitedError('You have no admin permissions'));

    next();
  }

  /**
   * Checks user rights in request\
   * Makes sure that user is superadmin\
   * Middleware prerequisites: verifyToken, setVerifyOptional, userRightsExtractor
   */
  async superAdminCheck(req: RequestMiddle, res: Response, next: NextFunction): Promise<void> {

    if (!req.rights || !req.userId) return next(new ApplicationError('Wrong usage of an adminCheck middleware in app code; use userRightsExtractor before adminCheck. Please, contact admins'));

    if (req.rights !== 'admin') return next(new ProhibitedError('You have no admin permissions'));

    const user = await this.userRepo.getById(req.userId);
  
    if (user.phonenumber !== config.SUPERADMIN_PHONENUMBER) return next(new ProhibitedError(`Please, call superadmin to resolve this problem ${config.SUPERADMIN_PHONENUMBER}`));

    next();
  }

  // sessionCheck(req: RequestMiddle, res: Response, next: NextFunction): void, // NOT NEEDED anymore: use userRightsExtractor instead

  /**
   * Checks request params\
   * Makes sure that request params are numeric\
   * Middleware prerequisites: no
   */
  requestParamsCheck(req: RequestMiddle, res: Response, next: NextFunction): void {
    
    if (!req.params) return next();

    for (const paramKey in req.params)
      if (paramKey.toLowerCase().endsWith('id') && isNaN(Number(req.params[paramKey])))
        return next(new RequestQueryError('Request params malformed'));
  
    next();
  }

  unknownEndpoint(req: Request, res: Response): void {
    res.status(404).json({
      error: {
        name: 'UnknownEndpoint',
        message: 'UnknownEndpoint'
      }
    });
  }

}