import type { IDatabaseConnectionHandler, IMigration, IMigrationConf } from '../interfaces';
import type { Options } from 'sequelize';
import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { logger } from '@m-cafe-app/utils';
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
  initModelHooks,
  initUserScopes,
  initFacilityScopes,
  initFoodScopes,
  initOrderScopes
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

    if (this.dbInstance) return Promise.resolve();

    const connection = new Promise<void>((resolve, reject) => {
      try {
        this.dbInstance = new Sequelize(
          DATABASE_URL,
          this.dbConf
        );

        resolve();
      } catch (err) {
        reject(err);
      }
    });

    try {
      await connection;
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return await this.connect();
      } else {
        return process.exit(1);
      }
    }

    await this.initModels();
  }

  async pingDb(): Promise<void> {

    if (!this.dbInstance) {
      await this.connect();
      return this.pingDb();
    }

    try {
      await this.dbInstance.authenticate();
      logger.info('connected to the database');
    } catch (err) {
      logger.error(err as string);
      logger.info('failed to connect to the database');
      if (process.env.NODE_ENV === 'production') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return await this.pingDb();
      } else {
        return process.exit(1);
      }
    }
  }

  async close(): Promise<void> {

    if (!this.dbInstance) return Promise.resolve();

    try {
      await this.dbInstance.close();
      logger.info('closed the database connection');
      this.dbInstance = undefined;
    } catch (err) {
      logger.error(err as string);
      logger.info('failed to close the database connection');
      if (process.env.NODE_ENV === 'production') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return await this.close();
      } else {
        return process.exit(1);
      }
    }
  }

  async loadMigrations(): Promise<void> {

    if (!this.dbInstance) {
      await this.connect();
      return this.loadMigrations();
    }

    this.migrations = await this.migrationLoader();
    this.migrationConf = {
      migrations: this.migrations,
      storage: new SequelizeStorage({ sequelize: this.dbInstance, tableName: 'migrations' }),
      context: this.dbInstance.getQueryInterface(),
      logger: process.env.NODE_ENV === 'test' ? undefined : console,
    };
  }

  async runMigrations(): Promise<void> {

    if (!this.migrationConf) {
      await this.loadMigrations();
      return this.runMigrations();
    }

    await this.pingDb();
    const migrator = new Umzug(this.migrationConf);
    const migrationsDone = await migrator.up();
    logger.info('Migrations up to date', {
      files: migrationsDone.map((mig) => mig.name),
    });
  }

  async rollbackMigration(): Promise<void> {

    if (!this.migrationConf) {
      await this.loadMigrations();
      return this.rollbackMigration();
    }

    await this.pingDb();
    const migrator = new Umzug(this.migrationConf);
    await migrator.down();
  }

  private async initModels(): Promise<void> {

    if (!this.dbInstance) {
      await this.connect();
      return Promise.resolve(); // Init models is called in connect
    }

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

    // Init models scopes that are dependant on models initialized after them
    await initUserScopes();
    await initFacilityScopes();
    await initFoodScopes();
    await initOrderScopes();
  }
}