/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction, Request, Response } from 'express';


export interface IErrorHandler {
  handleError(...args: any): void;
}

export interface IExpressErrorHandler {
  handleError(error: unknown, req: Request, res: Response, next: NextFunction): void;
}