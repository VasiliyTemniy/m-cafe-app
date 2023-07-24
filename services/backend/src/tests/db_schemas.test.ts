import { expect } from "chai";
import "mocha";
import { getDBInfo } from "./db_schemas_helper";
import { Sequelize } from 'sequelize';
import { loadMigrations } from "../migrations";
import { SequelizeStorage, Umzug } from "umzug";
import { connectToDatabase } from "../utils/db";
import config from "../utils/config";
import supertest from "supertest";
import app from "../app";
import { apiBaseUrl } from "./test_helper";
import { diffString } from 'json-diff';


const api = supertest(app);


describe('Database migrations code is synchronized with models code', () => {

  it('Schema diff comparison should be null', async () => {

    if (process.env.RUN_COMPARISON_TEST === 'false') return;


    await connectToDatabase();

    await api
      .get(`${apiBaseUrl}/testing/reset`)
      .expect(204);

    await api
      .get(`${apiBaseUrl}/testing/sync`)
      .expect(204);

    const comparisonDbUrl = process.env.COMPARISON_DATABASE_URL as string;

    const disablePgDbSSL = !(process.env.PG_DB_USE_SSL === 'true');

    const sequelizeMigrated = new Sequelize(comparisonDbUrl, {
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

    const migrations = await loadMigrations();

    const initiateComparisonDatabase = async (sequelize: Sequelize) => {

      await sequelize.authenticate();

      await sequelize.drop();

      const migrationConf = {
        migrations,
        storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
        context: sequelize.getQueryInterface(),
        logger: undefined,
      };

      const runMigrations = async () => {
        const migrator = new Umzug(migrationConf);
        await migrator.up();
      };

      await runMigrations();

    };

    await initiateComparisonDatabase(sequelizeMigrated);


    const dbInfo = await getDBInfo(config.DATABASE_URL, comparisonDbUrl);


    const deepEqual = (obj1: object, obj2: object): boolean => {
      const str1 = JSON.stringify(obj1);
      const str2 = JSON.stringify(obj2);

      return str1 === str2;
    };

    const state = deepEqual(dbInfo.info1.schemas, dbInfo.info2.schemas);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (!state) console.log(diffString(dbInfo.info1.schemas, dbInfo.info2.schemas));

    expect(state).to.equal(true);


  });

});

