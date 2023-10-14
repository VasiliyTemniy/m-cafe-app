/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Gets T to store, returns simple version TS, usually with cut id
 */
export interface IInmemRepo<T, TS> {
  getMany(...filterArgs: any): Promise<TS[]>;
  storeMany(ds: T[]): Promise<void>;
  remove(key: string): Promise<void>;
  removeAll(): Promise<void>;
  connect(): Promise<void>;
  ping(): Promise<void>;
  close(): Promise<void>;
}