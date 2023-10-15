import type { Options } from 'sequelize';
import * as dotenv from 'dotenv';
import path from 'path';

export const isDockerized = (process.env.DOCKERIZED_DEV === 'true' || process.env.DOCKERIZED === 'true');

dotenv.config({
  path: path.resolve('../../services/backend/.env'),
  override: isDockerized ? false : true
});

export const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_DATABASE_URL as string
  : process.env.DATABASE_URL as string;

const disablePgDbSSL = !(process.env.PG_DB_USE_SSL === 'true');

export const dbConf: Options = {
  dialect: 'postgres',
  protocol: 'postgres',
  ssl: disablePgDbSSL ? false : true,
  dialectOptions: {
    ssl: disablePgDbSSL ? false : true && {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: !(process.env.NODE_ENV === 'test')
};

export default {
  DATABASE_URL
};