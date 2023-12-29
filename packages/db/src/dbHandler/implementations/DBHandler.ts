import type { IDBHandler, IMigration, IMigrationConf } from '../interfaces';
import type { Options } from 'sequelize';
import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import { logger } from '@m-cafe-app/utils';
import { DATABASE_URL } from '../../config';
import * as models from '../../models';
import * as constants from '@m-cafe-app/shared-constants';


export class DBHandler implements IDBHandler {

  public dbInstance: Sequelize | undefined = undefined;
  public models = models;

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

    await this.models.initAddressModel(this.dbInstance);
    await this.models.initLanguageModel(this.dbInstance);
    await this.models.initLocStringModel(this.dbInstance);
    await this.models.initLocModel(this.dbInstance);
    await this.models.initFixedLocModel(this.dbInstance);
    await this.models.initCurrencyModel(this.dbInstance);
    await this.models.initCurrencyConversionModel(this.dbInstance);
    await this.models.initPictureModel(this.dbInstance);
    await this.models.initUserModel(this.dbInstance);
    await this.models.initUserAddressModel(this.dbInstance);
    await this.models.initCoverageModel(this.dbInstance);
    await this.models.initOrganizationModel(this.dbInstance);
    await this.models.initOfferPolicyModel(this.dbInstance);
    await this.models.initOrderPolicyModel(this.dbInstance);
    await this.models.initDeliveryPolicyModel(this.dbInstance);
    await this.models.initOrganizationManagerModel(this.dbInstance);
    await this.models.initRoleModel(this.dbInstance);
    await this.models.initUserRoleModel(this.dbInstance);
    await this.models.initPermissionModel(this.dbInstance);
    await this.models.initRolePermissionModel(this.dbInstance);
    await this.models.initProductTypeModel(this.dbInstance);
    await this.models.initProductCategoryModel(this.dbInstance);
    await this.models.initProductModel(this.dbInstance);
    await this.models.initProductCategoryReferenceModel(this.dbInstance);
    await this.models.initProductComponentModel(this.dbInstance);
    await this.models.initIngredientModel(this.dbInstance);
    await this.models.initFacilityModel(this.dbInstance);
    await this.models.initStockModel(this.dbInstance);
    await this.models.initCommentModel(this.dbInstance);
    await this.models.initOrderModel(this.dbInstance);
    await this.models.initOrderProductModel(this.dbInstance);
    await this.models.initOrderTrackingModel(this.dbInstance);
    await this.models.initDynamicModuleModel(this.dbInstance);
    await this.models.initDynamicModulePageModel(this.dbInstance);
    await this.models.initUiSettingModel(this.dbInstance);
    await this.models.initReviewModel(this.dbInstance);
    await this.models.initCarrierModel(this.dbInstance);
    await this.models.initOfferModel(this.dbInstance);
    await this.models.initOfferBonusModel(this.dbInstance);
    await this.models.initSaleEventModel(this.dbInstance);
    await this.models.initPromoEventModel(this.dbInstance);
    await this.models.initPromoEventCodeModel(this.dbInstance);
    await this.models.initApiRequestModel(this.dbInstance);
    await this.models.initApiRequestHeaderModel(this.dbInstance);
    await this.models.initApiRequestParamModel(this.dbInstance);
    await this.models.initApiRequestQueryStringPartModel(this.dbInstance);
    await this.models.initApiRequestBodyPartModel(this.dbInstance);
    await this.models.initApiRequestTokenModel(this.dbInstance);
    await this.models.initApiResponseExpectationModel(this.dbInstance);
    await this.models.initContactModel(this.dbInstance);
    await this.models.initSemanticsModel(this.dbInstance);
    await this.models.initSemanticValueModel(this.dbInstance);
    await this.models.initDetailGroupModel(this.dbInstance);
    await this.models.initDetailModel(this.dbInstance);
    await this.models.initViewModel(this.dbInstance);
    await this.models.initTagModel(this.dbInstance);
    await this.models.initFixedEnumModel(this.dbInstance);

    await this.models.initAddressAssociations();
    await this.models.initLanguageAssociations();
    await this.models.initLocStringAssociations();
    await this.models.initLocAssociations();
    await this.models.initFixedLocAssociations();
    await this.models.initCurrencyAssociations();
    await this.models.initCurrencyConversionAssociations();
    await this.models.initPictureAssociations();
    await this.models.initUserAssociations();
    await this.models.initOrganizationAssociations();
    await this.models.initOfferPolicyAssociations();
    await this.models.initOrderPolicyAssociations();
    await this.models.initDeliveryPolicyAssociations();
    await this.models.initRoleAssociations();
    await this.models.initPermissionAssociations();
    await this.models.initProductTypeAssociations();
    await this.models.initProductCategoryAssociations();
    await this.models.initProductAssociations();
    await this.models.initProductComponentAssociations();
    await this.models.initIngredientAssociations();
    await this.models.initFacilityAssociations();
    await this.models.initStockAssociations();
    await this.models.initCommentAssociations();
    await this.models.initOrderAssociations();
    await this.models.initOrderTrackingAssociations();
    await this.models.initDynamicModuleAssociations();
    await this.models.initDynamicModulePageAssociations();
    await this.models.initUiSettingAssociations();
    await this.models.initReviewAssociations();
    await this.models.initCarrierAssociations();
    await this.models.initOfferAssociations();
    await this.models.initOfferBonusAssociations();
    await this.models.initSaleEventAssociations();
    await this.models.initPromoEventAssociations();
    await this.models.initPromoEventCodeAssociations();
    await this.models.initApiRequestAssociations();
    await this.models.initApiRequestHeaderAssociations();
    await this.models.initApiRequestParamAssociations();
    await this.models.initApiRequestQueryStringPartAssociations();
    await this.models.initApiRequestBodyPartAssociations();
    await this.models.initApiRequestTokenAssociations();
    await this.models.initApiResponseExpectationAssociations();
    await this.models.initContactAssociations();
    await this.models.initSemanticsAssociations();
    await this.models.initSemanticValueAssociations();
    await this.models.initDetailGroupAssociations();
    await this.models.initDetailAssociations();
    await this.models.initViewAssociations();
    await this.models.initTagAssociations();

    await this.models.initPictureHooks();
    await this.models.initCommentHooks();
    await this.models.initProductHooks();
    await this.models.initProductComponentHooks();
    await this.models.initReviewHooks();
    await this.models.initStockHooks();

    await this.models.initUserScopes();
  }

  private async initFixedEnums(): Promise<void> {
    
    const checkEnum = async (name: keyof typeof constants) => {
      const constant = constants[name];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const key in constant as Record<string, any>) {

        const foundEnum = await this.models.FixedEnum.findOne({
          where: {
            name,
            key
          }
        });
      
        if (!foundEnum) {
          await this.models.FixedEnum.create({
            name,
            key,
            value: constant[key as keyof typeof constant]
          });
          return;
        }

        if (foundEnum?.value !== constant[key as keyof typeof constant]) {
          throw new Error(`${name} enum value mismatch: ${foundEnum?.value} !== ${constant[key as keyof typeof constant]}`);
        }
      }
    };

    await checkEnum('LocType');
    await checkEnum('LocParentType');
    await checkEnum('FixedLocScope');
    await checkEnum('PictureParentType');
    await checkEnum('UserRights');
    await checkEnum('CoverageParentType');
    await checkEnum('CoverageEntityType');
    await checkEnum('OfferType');
    await checkEnum('OfferGrantMethod');
    await checkEnum('OfferCodeGenerationMethod');
    await checkEnum('OrderStatus');
    await checkEnum('OrderPaymentMethod');
    await checkEnum('OrderPaymentStatus');
    await checkEnum('OrderDeliveryType');
    await checkEnum('OrderDistanceAvailability');
    await checkEnum('OrderConfirmationMethod');
    await checkEnum('DeliveryCostCalculationType');
    await checkEnum('MassEnum');
    await checkEnum('SizingEnum');
    await checkEnum('VolumeEnum');
    await checkEnum('PermissionTarget');
    await checkEnum('PermissionAccess');
    await checkEnum('PermissionAction');
    await checkEnum('PriceCutPermission');
    await checkEnum('FacilityType');
    await checkEnum('StockEntityType');
    await checkEnum('StockStatus');
    await checkEnum('CommentParentType');
    await checkEnum('OrderTrackingStatus');
    await checkEnum('DynamicModuleType');
    await checkEnum('DynamicModulePreset');
    await checkEnum('DynamicModulePlacementType');
    await checkEnum('DynamicModulePageType');
    await checkEnum('UiSettingComponentGroup');
    await checkEnum('UiSettingTheme');
    await checkEnum('ReviewParentType');
    await checkEnum('ApiRequestReason');
    await checkEnum('ApiRequestMethod');
    await checkEnum('ApiRequestExpectedResponseDataPlacementKey');
    await checkEnum('ApiRequestExpectedResponseDataType');
    await checkEnum('ApiRequestProtocol');
    await checkEnum('ApiRequestTokenPlacement');
    await checkEnum('ContactType');
    await checkEnum('ContactTarget');
    await checkEnum('ContactParentType');
    await checkEnum('DetailGroupParentType');
    await checkEnum('ViewParentType');
    await checkEnum('TagParentType');

  }
}