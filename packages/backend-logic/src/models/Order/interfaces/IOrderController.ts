/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ICRUDController, ICRUDControllerHttp } from '../../../utils';
import type { Request, Response } from 'express';

export interface IOrderController extends ICRUDController {
  getSome(...args: any): Promise<any>;
  updateStatus(...args: any): Promise<any>;
}

export interface IOrderControllerExpressHttp extends ICRUDControllerHttp {
  getSome(req: Request, res: Response): Promise<void>;
  updateStatus(req: Request, res: Response): Promise<void>;
}