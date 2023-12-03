/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ICRUDController, ICRUDControllerHttp } from '../../../utils';
import type { Request, Response } from 'express';

export interface IFoodController extends ICRUDController {
  getByIdWithAssociations(...args: any): Promise<any>;
  getSomeWithAssociations(...args: any): Promise<any>;
  addPicture(...args: any): Promise<any>;
  updatePicturesOrder(...args: any): Promise<any>;
  removePicture(...args: any): Promise<any>;
  removePicturesByFoodId(...args: any): Promise<any>;
}

export interface IFoodControllerHttp extends ICRUDControllerHttp {
  getByIdWithAssociations(req: Request, res: Response): Promise<void>;
  getSomeWithAssociations(req: Request, res: Response): Promise<void>;
  addPicture(req: Request, res: Response): Promise<void>;
  updatePicturesOrder(req: Request, res: Response): Promise<void>;
  removePicture(req: Request, res: Response): Promise<void>;
  removePicturesByFoodId(req: Request, res: Response): Promise<void>;
}