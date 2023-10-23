/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ICRUDController, ICRUDControllerHttp } from '../../../utils';
import type { Request, Response } from 'express';

export interface IUserController extends ICRUDController {
  getByScope(...args: any): Promise<void>;
  getSome(...args: any): Promise<void>;
  administrate(...args: any): Promise<void>;
  login(...args: any): Promise<void>;
  logout(...args: any): Promise<void>;
  createAddress(...args: any): Promise<void>;
  updateAddress(...args: any): Promise<void>;
  removeAddress(...args: any): Promise<void>;
  getWithAddress(...args: any): Promise<void>;
}

export interface IUserControllerHttp extends ICRUDControllerHttp {
  getByScope(req: Request, res: Response): Promise<void>;
  getSome(req: Request, res: Response): Promise<void>;
  administrate(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  createAddress(req: Request, res: Response): Promise<void>;
  updateAddress(req: Request, res: Response): Promise<void>;
  removeAddress(req: Request, res: Response): Promise<void>;
  getWithAddress(req: Request, res: Response): Promise<void>;
} 