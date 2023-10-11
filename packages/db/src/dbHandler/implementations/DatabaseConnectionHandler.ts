// UNCOMMENT LOGGER AND APPLICATION ERROR AFTER FINISHING WITH REFACTOR OF BACKEND-LOGIC

import type { IDatabaseConnectionHandler, IMigration, IMigrationConf } from '../interfaces';
import type { Options } from 'sequelize';
import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
// import { ApplicationError, logger } from '@m-cafe-app/utils';
import { DATABASE_URL } from '../../config';
import {
  initUserModel,
  initAddressModel,
  initUserAddressModel,
  initLocStringModel,
  initFoodTypeModel,
  initFoodModel,
  initIngredientModel,
  initFoodComponentModel,
  initFacilityModel,
  initFacilityManagerModel,
  initStockModel,
  initOrderModel,
  initOrderFoodModel,
  initPictureModel,
  initDynamicModuleModel,
  initFoodPictureModel,
  initUiSettingModel,
  initFixedLocModel,
  initModelAssociations,
  initModelHooks
} from '../../models';


export class DatabaseConnectionHandler implements IDatabaseConnectionHandler {

  public dbInstance: Sequelize | undefined = undefined;

  private migrations: IMigration[] = [];
  private migrationConf: IMigrationConf | undefined = undefined;

  constructor(
    readonly dbConf: Options,
    readonly migrationLoader: () => Promise<IMigration[]>
  ) {}

  async connect(): Promise<void> {

    if (this.dbInstance)
      throw new Error('Database connection is already initialized');
      // throw new ApplicationError('Database connection is already initialized');


    this.dbInstance = new Sequelize(
      DATABASE_URL,
      this.dbConf
    );

    await this.initModels();
  }

  async pingDb(): Promise<void> {

    if (!this.dbInstance)
      throw new Error('Database connection is not initialized');
      // throw new ApplicationError('Database connection is not initialized');


    try {
      await this.dbInstance.authenticate();
      // logger.info('connected to the database');
    } catch (err) {
      // logger.error(err as string);
      // logger.info('failed to connect to the database');
      if (process.env.NODE_ENV === 'production') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return await this.pingDb();
      } else {
        return process.exit(1);
      }
    }
  }

  async close(): Promise<void> {

    if (!this.dbInstance)
      throw new Error('Database connection is not initialized');
      // throw new ApplicationError('Database connection is not initialized');


    try {
      await this.dbInstance.close();
      // logger.info('closed the database connection');
      this.dbInstance = undefined;
    } catch (err) {
      // logger.error(err as string);
      // logger.info('failed to close the database connection');
      if (process.env.NODE_ENV === 'production') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return await this.close();
      } else {
        return process.exit(1);
      }
    }
  }

  async loadMigrations(): Promise<void> {

    if (!this.dbInstance)
      throw new Error('Database connection is not initialized');
      // throw new ApplicationError('Database connection is not initialized');


    this.migrations = await this.migrationLoader();
    this.migrationConf = {
      migrations: this.migrations,
      storage: new SequelizeStorage({ sequelize: this.dbInstance, tableName: 'migrations' }),
      context: this.dbInstance.getQueryInterface(),
      logger: process.env.NODE_ENV === 'test' ? undefined : console,
    };
  }

  async runMigrations(): Promise<void> {

    if (!this.migrationConf)
      throw new Error('Migration configuration is not initialized. Load migrations first.');
      // throw new ApplicationError('Migration configuration is not initialized. Load migrations first.');


    await this.pingDb();
    const migrator = new Umzug(this.migrationConf);
    await migrator.up();
    // const migrationsDone = await migrator.up();
    // logger.info('Migrations up to date', {
    //   files: migrationsDone.map((mig) => mig.name),
    // });
  }

  async rollbackMigration(): Promise<void> {

    if (!this.migrationConf)
      throw new Error('Migration configuration is not initialized. Load migrations first.');
      // throw new ApplicationError('Migration configuration is not initialized. Load migrations first.');


    await this.pingDb();
    const migrator = new Umzug(this.migrationConf);
    await migrator.down();
  }

  private async initModels(): Promise<void> {

    if (!this.dbInstance)
      throw new Error('Database connection is not initialized');
      // throw new ApplicationError('Database connection is not initialized');

    
    await initUserModel(this.dbInstance);
    await initAddressModel(this.dbInstance);
    await initUserAddressModel(this.dbInstance);
    await initLocStringModel(this.dbInstance);
    await initFoodTypeModel(this.dbInstance);
    await initFoodModel(this.dbInstance);
    await initIngredientModel(this.dbInstance);
    await initFoodComponentModel(this.dbInstance);
    await initFacilityModel(this.dbInstance);
    await initFacilityManagerModel(this.dbInstance);
    await initStockModel(this.dbInstance);
    await initOrderModel(this.dbInstance);
    await initOrderFoodModel(this.dbInstance);
    await initPictureModel(this.dbInstance);
    await initDynamicModuleModel(this.dbInstance);
    await initFoodPictureModel(this.dbInstance);
    await initUiSettingModel(this.dbInstance);
    await initFixedLocModel(this.dbInstance);

    await initModelAssociations();
    await initModelHooks();

  }
}