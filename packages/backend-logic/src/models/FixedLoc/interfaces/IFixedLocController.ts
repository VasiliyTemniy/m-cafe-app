/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ICRUDController, ICRUDControllerHttp } from '../../../utils';
import type { Request, Response } from 'express';

export interface IFixedLocController extends ICRUDController {
  getByScope(...args: any): Promise<void>
  reset(...args: any): Promise<void>
}

export interface IFixedLocControllerHttp extends ICRUDControllerHttp {
  getByScope(req: Request, res: Response): Promise<void>
  reset(req: Request, res: Response): Promise<void>
}