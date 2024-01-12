/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ICRUDController, ICRUDControllerHttp } from '../../../utils';
import type { Request, Response } from 'express';

export interface IFacilityController extends ICRUDController {
  getAllWithAssociations(...args: any): Promise<any>;
  getByIdWithAssociations(...args: any): Promise<any>;
  createStock(...args: any): Promise<any>;
  createManyStocks(...args: any): Promise<any>;
  updateStock(...args: any): Promise<any>;
  updateManyStocks(...args: any): Promise<any>;
  removeStock(...args: any): Promise<any>;
  removeManyStocks(...args: any): Promise<any>;
  addManagers(...args: any): Promise<any>;
  removeManagers(...args: any): Promise<any>;
}

export interface IFacilityControllerHttp extends ICRUDControllerHttp {
  getAllWithAssociations(req: Request, res: Response): Promise<void>;
  getByIdWithAssociations(req: Request, res: Response): Promise<void>;
  createStock(req: Request, res: Response): Promise<void>;
  createManyStocks(req: Request, res: Response): Promise<void>;
  updateStock(req: Request, res: Response): Promise<void>;
  updateManyStocks(req: Request, res: Response): Promise<void>;
  removeStock(req: Request, res: Response): Promise<void>;
  removeManyStocks(req: Request, res: Response): Promise<void>;
  addManagers(req: Request, res: Response): Promise<void>;
  removeManagers(req: Request, res: Response): Promise<void>;
}