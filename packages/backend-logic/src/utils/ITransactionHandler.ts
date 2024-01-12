export interface GenericTransaction {
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface ITransactionHandler {
  start(): Promise<GenericTransaction>;
  commit(t: GenericTransaction): Promise<void>;
  rollback(t: GenericTransaction): Promise<void>;
}