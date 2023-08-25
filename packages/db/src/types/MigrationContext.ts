import { QueryInterface } from 'sequelize';

export interface MigrationContext {
  context: QueryInterface;
}