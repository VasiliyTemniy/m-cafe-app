/* eslint-disable @typescript-eslint/no-explicit-any */
// import type { MapToDTN, MapToDT } from './typeMappers.js';
import type { Request, Response } from 'express';

export interface ICRUDRepo<T, DTN> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T>;
  create(dtn: DTN, ...args: any): Promise<T>;
  update(d: T, ...args: any): Promise<T>;
  remove(id: number): Promise<void> | Promise<T>;
  removeAll(): Promise<void>;
  createMany?(dtns: DTN[]): Promise<T[]>;
  updateMany?(ds: T[]): Promise<T[]>;
  removeMany?(ids: number[]): Promise<void>;
}

export interface ICRUDService<DT, DTN> {
  getAll(): Promise<DT[]>;
  getById(id: number): Promise<DT>;
  create(dtn: DTN, ...args: any): Promise<DT>;
  update(dt: DT, ...args: any): Promise<DT>;
  remove(id: number): Promise<void> | Promise<DT>;
  removeAll(): Promise<void>;
  createMany?(dtns: DTN[]): Promise<DT[]>;
  updateMany?(dts: DT[]): Promise<DT[]>;
  removeMany?(ids: number[]): Promise<void>;
}

export interface ICRUDController {
  getAll(...args: any): Promise<void>;
  getById(...args: any): Promise<void>;
  create?(...args: any): Promise<void>;
  update?(...args: any): Promise<void>;
  remove?(...args: any): Promise<void>;
  createMany?(...args: any): Promise<void>;
  updateMany?(...args: any): Promise<void>;
  removeMany?(...args: any): Promise<void>;
}

export interface ICRUDControllerHttp extends ICRUDController {
  getAll(req: Request, res: Response, ...args: any): Promise<void>;
  getById(req: Request, res: Response, ...args: any): Promise<void>;
  create?(req: Request, res: Response, ...args: any): Promise<void>;
  update?(req: Request, res: Response, ...args: any): Promise<void>;
  remove?(req: Request, res: Response, ...args: any): Promise<void>;
  createMany?(req: Request, res: Response, ...args: any): Promise<void>;
  updateMany?(req: Request, res: Response, ...args: any): Promise<void>;
  removeMany?(req: Request, res: Response, ...args: any): Promise<void>;
}