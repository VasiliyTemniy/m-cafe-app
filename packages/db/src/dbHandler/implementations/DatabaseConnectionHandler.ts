import type { IDatabaseConnectionHandler, IMigration, IMigrationConf } from '../interfaces';
import type { Options } from 'sequelize';
import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { logger } from '@m-cafe-app/utils';
import { DATABASE_URL } from '../../config';
import * as models from '../../models';


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

    await models.initAddressModel(this.dbInstance);
    await models.initLanguageModel(this.dbInstance);
    await models.initLocModel(this.dbInstance);
    await models.initFixedLocModel(this.dbInstance);
    await models.initCurrencyModel(this.dbInstance);
    await models.initCurrencyConversionModel(this.dbInstance);
    await models.initPictureModel(this.dbInstance);
    await models.initPictureViewModel(this.dbInstance);
    await models.initUserModel(this.dbInstance);
    await models.initUserAddressModel(this.dbInstance);
    await models.initCoverageModel(this.dbInstance);
    await models.initOrganizationModel(this.dbInstance);
    await models.initOrganizationDetailModel(this.dbInstance);
    await models.initOfferPolicyModel(this.dbInstance);
    await models.initOrderPolicyModel(this.dbInstance);
    await models.initDeliveryPolicyModel(this.dbInstance);
    await models.initOrganizationManagerModel(this.dbInstance);
    await models.initRoleModel(this.dbInstance);
    await models.initUserRoleModel(this.dbInstance);
    await models.initPermissionModel(this.dbInstance);
    await models.initRolePermissionModel(this.dbInstance);
    await models.initProductTypeModel(this.dbInstance);
    await models.initProductCategoryModel(this.dbInstance);
    await models.initProductModel(this.dbInstance);
    await models.initProductCategoryReferenceModel(this.dbInstance);
    await models.initProductComponentModel(this.dbInstance);
    await models.initProductDetailModel(this.dbInstance);
    await models.initProductViewModel(this.dbInstance);
    await models.initIngredientModel(this.dbInstance);
    await models.initFacilityModel(this.dbInstance);
    await models.initFacilityDetailModel(this.dbInstance);
    await models.initStockModel(this.dbInstance);
    await models.initCommentModel(this.dbInstance);
    await models.initOrderModel(this.dbInstance);
    await models.initOrderProductModel(this.dbInstance);
    await models.initOrderTrackingModel(this.dbInstance);
    await models.initDynamicModuleModel(this.dbInstance);
    await models.initDynamicModulePageModel(this.dbInstance);
    await models.initUiSettingModel(this.dbInstance);
    await models.initReviewModel(this.dbInstance);
    await models.initCarrierModel(this.dbInstance);
    await models.initOfferModel(this.dbInstance);
    await models.initOfferBonusModel(this.dbInstance);
    await models.initSaleEventModel(this.dbInstance);
    await models.initPromoEventModel(this.dbInstance);
    await models.initPromoEventCodeModel(this.dbInstance);
    await models.initApiRequestModel(this.dbInstance);
    await models.initApiRequestHeaderModel(this.dbInstance);
    await models.initApiRequestParamModel(this.dbInstance);
    await models.initApiRequestQueryStringPartModel(this.dbInstance);
    await models.initApiRequestBodyPartModel(this.dbInstance);
    await models.initApiRequestTokenModel(this.dbInstance);
    await models.initApiResponseExpectationModel(this.dbInstance);
    await models.initContactModel(this.dbInstance);

    await models.initAddressAssociations();
    await models.initLanguageAssociations();
    await models.initLocAssociations();
    await models.initFixedLocAssociations();
    await models.initCurrencyAssociations();
    await models.initCurrencyConversionAssociations();
    await models.initPictureAssociations();
    await models.initPictureViewAssociations();
    await models.initUserAssociations();
    await models.initOrganizationAssociations();
    await models.initOrganizationDetailAssociations();
    await models.initOfferPolicyAssociations();
    await models.initOrderPolicyAssociations();
    await models.initDeliveryPolicyAssociations();
    await models.initRoleAssociations();
    await models.initPermissionAssociations();
    await models.initProductTypeAssociations();
    await models.initProductCategoryAssociations();
    await models.initProductAssociations();
    await models.initProductComponentAssociations();
    await models.initProductDetailAssociations();
    await models.initProductViewAssociations();
    await models.initIngredientAssociations();
    await models.initFacilityAssociations();
    await models.initFacilityDetailAssociations();
    await models.initStockAssociations();
    await models.initCommentAssociations();
    await models.initOrderAssociations();
    await models.initOrderTrackingAssociations();
    await models.initDynamicModuleAssociations();
    await models.initDynamicModulePageAssociations();
    await models.initUiSettingAssociations();
    await models.initReviewAssociations();
    await models.initCarrierAssociations();
    await models.initOfferAssociations();
    await models.initOfferBonusAssociations();
    await models.initSaleEventAssociations();
    await models.initPromoEventAssociations();
    await models.initPromoEventCodeAssociations();
    await models.initApiRequestAssociations();
    await models.initApiRequestHeaderAssociations();
    await models.initApiRequestParamAssociations();
    await models.initApiRequestQueryStringPartAssociations();
    await models.initApiRequestBodyPartAssociations();
    await models.initApiRequestTokenAssociations();
    await models.initApiResponseExpectationAssociations();
    await models.initContactAssociations();

    await models.initPictureHooks();
    await models.initCommentHooks();
    await models.initProductHooks();
    await models.initProductComponentHooks();
    await models.initReviewHooks();
    await models.initStockHooks();

    await models.initUserScopes();
  }
}