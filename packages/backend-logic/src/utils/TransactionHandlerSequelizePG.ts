import type { IDatabaseConnectionHandler } from '@m-cafe-app/db';
import type { ITransactionHandler } from './ITransactionHandler.js';
import { DatabaseError } from '@m-cafe-app/utils';
import { Sequelize, Transaction as SequelizeTransaction } from 'sequelize';


export class TransactionHandlerSequelizePG implements ITransactionHandler {

  private dbInstance: Sequelize;

  constructor(
    readonly dbHandler: IDatabaseConnectionHandler
  ) {
    if (!dbHandler.dbInstance) {
      throw new DatabaseError('No database connection');
    }
    this.dbInstance = dbHandler.dbInstance;
  }

  async start(): Promise<SequelizeTransaction> {
    return await this.dbInstance.transaction();
  }

  async commit(t: SequelizeTransaction): Promise<void> {
    await t.commit();
  }

  async rollback(t: SequelizeTransaction): Promise<void> {
    await t.rollback();
  }
  
}