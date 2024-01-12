/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ICRUDController, ICRUDControllerHttp } from '../../../utils';
import type { Request, Response } from 'express';

export interface IDynamicModuleController extends ICRUDController {
  getAllByPage(...args: any): Promise<any>;
  addLocString(...args: any): Promise<any>;
  removeLocString(...args: any): Promise<any>;
  addPicture(...args: any): Promise<any>;
  removePicture(...args: any): Promise<any>;
}

export interface IDynamicModuleControllerExpressHttp extends ICRUDControllerHttp {
  getAllByPage(req: Request, res: Response): Promise<void>;
  addLocString(req: Request, res: Response): Promise<void>;
  removeLocString(req: Request, res: Response): Promise<void>;
  addPicture(req: Request, res: Response): Promise<void>;
  removePicture(req: Request, res: Response): Promise<void>;
}