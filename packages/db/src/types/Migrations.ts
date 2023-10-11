import { QueryInterface } from 'sequelize';

export interface MigrationContext {
  context: QueryInterface;
}

export type MigrationFn = ({ context }: MigrationContext) => Promise<void>;