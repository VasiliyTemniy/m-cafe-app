import { QueryInterface } from '@m-cafe-app/shared-backend-deps/sequelize.js';

export interface MigrationContext {
  context: QueryInterface;
}