import config from './config.js';
import { logger } from '@m-cafe-app/utils';
import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { loadMigrations } from './loadMigrations.js';

const disablePgDbSSL = !(process.env.PG_DB_USE_SSL === 'true');

export const sequelize = new Sequelize(config.DATABASE_URL, {
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
});
logger.info('connecting to ' + config.DATABASE_URL);

export const connectToDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    // await runMigrations(); Remove this once we create DB handler infrastructure in packages/backend-logic
    logger.info('connected to the database');
  } catch (err) {
    logger.error(err as string);
    logger.info('failed to connect to the database');
    if (process.env.NODE_ENV === 'production')
      return await connectToDatabase();
    else
      return process.exit(1);
  }
};

const migrations = await loadMigrations();

const migrationConf = {
  migrations,
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: process.env.NODE_ENV === 'test' ? undefined : console,
};

export const runMigrations = async () => {
  const migrator = new Umzug(migrationConf);
  const migrationsDone = await migrator.up();
  logger.info('Migrations up to date', {
    files: migrationsDone.map((mig) => mig.name),
  });
};

export const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};