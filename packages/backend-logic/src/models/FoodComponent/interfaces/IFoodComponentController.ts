/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ICRUDController, ICRUDControllerHttp } from '../../../utils';
import type { Request, Response } from 'express';

export interface IFoodComponentController extends ICRUDController {
  getByFoodId(...args: any): Promise<any>;
  createMany(...args: any): Promise<any>;
  rewriteAllForOneFood(...args: any): Promise<any>;
  removeAllForOneFood(...args: any): Promise<any>;
}

export interface IFoodComponentControllerHttp extends ICRUDControllerHttp {
  getByFoodId(req: Request, res: Response): Promise<void>;
  createMany(req: Request, res: Response): Promise<void>;
  rewriteAllForOneFood(req: Request, res: Response): Promise<void>;
  removeAllForOneFood(req: Request, res: Response): Promise<void>;
}