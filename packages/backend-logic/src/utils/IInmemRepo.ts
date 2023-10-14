/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Shared inmem repo methods
 */
export interface IInmemRepoBase {
  removeAll(): Promise<void>;
  connect(): Promise<void>;
  ping(): Promise<void>;
  close(): Promise<void>;
}

/**
 * Gets T to store, returns simple version TS, usually with cut id
 */
export interface IInmemRepo<T, TS> extends IInmemRepoBase {
  getMany(...filterArgs: any): Promise<TS[]>;
  storeMany(ds: T[], ...args: any): Promise<void>;
  remove(identifier: string | number, ...args: any): Promise<void>;
}