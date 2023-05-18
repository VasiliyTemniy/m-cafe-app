import config from './config'
import logger from './logger'
import { Sequelize } from 'sequelize'
import { Umzug, SequelizeStorage } from 'umzug'

export const sequelize = new Sequelize(config.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})
logger.info('connecting to' + config.DATABASE_URL)

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    logger.info('connected to the database')
  } catch (err) {
    logger.info('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}
  
const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  logger.info('Migrations up to date' + {
    files: migrations.map((mig) => mig.name),
  })
}

export const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}
// export default { connectToDatabase, sequelize, rollbackMigration }