import { dbConf } from './config.js';
import { DatabaseConnectionHandler } from './dbHandler';
import { loadMigrations } from './loadMigrations.js';

export const dbHandler = new DatabaseConnectionHandler(
  dbConf,
  loadMigrations
);