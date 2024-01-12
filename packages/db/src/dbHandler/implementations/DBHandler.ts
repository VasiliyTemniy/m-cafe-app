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
    await this.models.initLocStringModel(this.dbInstance);
    await this.models.initLocModel(this.dbInstance);
    await this.models.initFixedLocModel(this.dbInstance);
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
    await this.models.initPromoEventCodeUsageModel(this.dbInstance);
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
    await this.models.initTagRelationModel(this.dbInstance);
    await this.models.initFixedEnumModel(this.dbInstance);

    await this.models.initAddressAssociations();
    await this.models.initLocStringAssociations();
    await this.models.initLocAssociations();
    await this.models.initFixedLocAssociations();
    await this.models.initCurrencyConversionAssociations();
    await this.models.initPictureAssociations();
    await this.models.initUserAssociations();
    await this.models.initOrganizationAssociations();
    await this.models.initOfferPolicyAssociations();
    await this.models.initOrderPolicyAssociations();
    await this.models.initDeliveryPolicyAssociations();
    await this.models.initRoleAssociations();
    await this.models.initUserRoleAssociations();
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
    await this.models.initPromoEventCodeUsageAssociations();
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

  private async checkEnum(name: keyof typeof constants) {
    const constant = constants[name];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const key in constant as { [key: string]: any }) {

      const foundEnum = await this.models.FixedEnum.findOne({
        where: {
          name,
          key: String(key)
        }
      });
    
      if (!foundEnum) {
        await this.models.FixedEnum.create({
          name,
          key: String(key),
          value: String(constant[key as keyof typeof constant])
        });
        return;
      }

      if (foundEnum.value !== String(constant[key as keyof typeof constant])) {
        throw new Error(`${name} enum value mismatch: ${foundEnum?.value} !== ${constant[key as keyof typeof constant]}`);
      }
    }
  }

  async initFixedEnums(): Promise<void> {

    await this.checkEnum('LanguageCode');
    await this.checkEnum('CurrencyCode');
    // Currency decimal multiplier is not an actual ts enum, but a special case
    await this.checkEnum('CurrencyDecimalMultiplier');
    await this.checkEnum('LocType');
    await this.checkEnum('LocParentType');
    await this.checkEnum('FixedLocScope');
    await this.checkEnum('PictureParentType');
    await this.checkEnum('UserRights');
    await this.checkEnum('CoverageParentType');
    await this.checkEnum('CoverageEntityType');
    await this.checkEnum('OfferType');
    await this.checkEnum('OfferGrantMethod');
    await this.checkEnum('OfferCodeGenerationMethod');
    await this.checkEnum('OrderStatus');
    await this.checkEnum('OrderPaymentMethod');
    await this.checkEnum('OrderPaymentStatus');
    await this.checkEnum('OrderDeliveryType');
    await this.checkEnum('OrderDistanceAvailability');
    await this.checkEnum('OrderConfirmationMethod');
    await this.checkEnum('DeliveryCostCalculationType');
    await this.checkEnum('MassMeasure');
    await this.checkEnum('SizingMeasure');
    await this.checkEnum('VolumeMeasure');
    await this.checkEnum('PermissionTarget');
    await this.checkEnum('PermissionAccess');
    await this.checkEnum('PermissionAction');
    await this.checkEnum('PriceCutPermission');
    await this.checkEnum('FacilityType');
    await this.checkEnum('StockEntityType');
    await this.checkEnum('StockStatus');
    await this.checkEnum('CommentParentType');
    await this.checkEnum('OrderTrackingStatus');
    await this.checkEnum('DynamicModuleType');
    await this.checkEnum('DynamicModulePreset');
    await this.checkEnum('DynamicModulePlacementType');
    await this.checkEnum('DynamicModulePageType');
    await this.checkEnum('UiSettingComponentGroup');
    await this.checkEnum('UiSettingTheme');
    await this.checkEnum('ReviewParentType');
    await this.checkEnum('ApiRequestReason');
    await this.checkEnum('ApiRequestMethod');
    await this.checkEnum('ApiRequestExpectedResponseDataPlacementKey');
    await this.checkEnum('ApiRequestExpectedResponseDataType');
    await this.checkEnum('ApiRequestProtocol');
    await this.checkEnum('ApiRequestTokenPlacement');
    await this.checkEnum('ContactType');
    await this.checkEnum('ContactTarget');
    await this.checkEnum('ContactParentType');
    await this.checkEnum('DetailGroupParentType');
    await this.checkEnum('ViewParentType');
    await this.checkEnum('TagParentType');

  }

  async wipeDb(): Promise<void> {

    if (process.env.NODE_ENV !== 'test') {
      return;
    }

    if (!this.dbInstance) {
      await this.connect();
      return this.wipeDb();
    }

    await this.dbInstance.truncate({ cascade: true, force: true });
  }
  
}