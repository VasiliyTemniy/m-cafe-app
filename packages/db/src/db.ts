import { dbConf } from './config.js';
import { DBHandler } from './dbHandler';
import { loadMigrations } from './loadMigrations.js';

export const dbHandler = new DBHandler(
  dbConf,
  loadMigrations
);