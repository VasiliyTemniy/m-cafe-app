/* eslint-disable @typescript-eslint/no-explicit-any */
import type { MapToDTNU } from './typeMappers.js';

export interface ICRUDRepo<T> {
  getAll(): Promise<T[]>;
  getById(id: number): Promise<T>;
  create?(dt: MapToDTNU<T>): Promise<T>;
  createMany?(dts: MapToDTNU<T>[]): Promise<T[]>;
  update?(dt: MapToDTNU<T>): Promise<T>;
  updateMany?(dts: MapToDTNU<T>[]): Promise<T[]>;
  remove?(id: number): Promise<void>;
  removeMany?(ids: number[]): Promise<void>;
}

export interface ICRUDService<DT> {
  getAll(...args: any): Promise<DT[]>;
  getById(...args: any): Promise<DT>;
  create?(...args: any): Promise<DT>;
  createMany?(...args: any): Promise<DT[]>;
  update?(...args: any): Promise<DT>;
  updateMany?(...args: any): Promise<DT[]>;
  remove?(...args: any): Promise<void>;
  removeMany?(...args: any): Promise<void>;
}

export interface ICRUDController {
  getAll(...args: any): Promise<void>;
  getById(...args: any): Promise<void>;
  create?(...args: any): Promise<void>;
  createMany?(...args: any): Promise<void>;
  update?(...args: any): Promise<void>;
  updateMany?(...args: any): Promise<void>;
  remove?(...args: any): Promise<void>;
  removeMany?(...args: any): Promise<void>;
}