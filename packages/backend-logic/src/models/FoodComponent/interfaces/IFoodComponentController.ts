/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ICRUDController, ICRUDControllerHttp } from '../../../utils';
import type { Request, Response } from 'express';

export interface IFoodComponentController extends ICRUDController {
  createMany(...args: any): Promise<any>;
  rewriteAllForOneFood(...args: any): Promise<any>;
}

export interface IFoodComponentControllerHttp extends ICRUDControllerHttp {
  createMany(req: Request, res: Response): Promise<void>;
  rewriteAllForOneFood(req: Request, res: Response): Promise<void>;
}