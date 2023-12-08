/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request, Response, NextFunction } from 'express';
import type { RequestMiddle } from '../../utils';


export interface IControllerMiddleware {
  requestLogger(...args: any): void,
  setVerifyOptional(...args: any): void,
  verifyToken(...args: any): void,
  userRightsExtractor(...args: any): void,
  userCheck(...args: any): void,
  managerCheck(...args: any): void,
  adminCheck(...args: any): void,
  superAdminCheck(...args: any): void,
  requestParamsCheck(...args: any): void,
  unknownEndpoint(...args: any): void
}

export interface IControllerExpressHttpMiddleware {
  requestLogger(req: Request, res: Response, next: NextFunction): void,
  setVerifyOptional(req: RequestMiddle, res: Response, next: NextFunction): void,
  verifyToken(req: RequestMiddle, res: Response, next: NextFunction): void,
  userRightsExtractor(req: RequestMiddle, res: Response, next: NextFunction): Promise<void>,
  userCheck(req: RequestMiddle, res: Response, next: NextFunction): void,
  managerCheck(req: RequestMiddle, res: Response, next: NextFunction): void,
  adminCheck(req: RequestMiddle, res: Response, next: NextFunction): void,
  superAdminCheck(req: RequestMiddle, res: Response, next: NextFunction): Promise<void>,
  requestParamsCheck(req: RequestMiddle, res: Response, next: NextFunction): void,
  unknownEndpoint(req: Request, res: Response): void
}