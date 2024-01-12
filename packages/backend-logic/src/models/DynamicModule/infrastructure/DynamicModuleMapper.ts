import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import type { DynamicModuleDT } from '@m-market-app/models';
import { DynamicModule } from '@m-market-app/models';
import { DynamicModule as DynamicModulePG } from '@m-market-app/db';
import { toOptionalISOString } from '@m-market-app/utils';
import { LocStringMapper } from '../../LocString';
import { PictureMapper } from '../../Picture';


export class DynamicModuleMapper implements
  EntityDBMapper<DynamicModule, DynamicModulePG>,
  EntityDTMapper<DynamicModule, DynamicModuleDT> {

  public static dbToDomain(dbDynamicModule: DynamicModulePG): DynamicModule {
    const locString = dbDynamicModule.locString
      ? LocStringMapper.dbToDomain(dbDynamicModule.locString)
      : undefined;

    const picture = dbDynamicModule.picture
      ? PictureMapper.dbToDomain(dbDynamicModule.picture)
      : undefined;

    const domainDynamicModule = new DynamicModule(
      dbDynamicModule.id,
      dbDynamicModule.moduleType,
      dbDynamicModule.page,
      dbDynamicModule.placement,
      dbDynamicModule.placementType,
      locString,
      dbDynamicModule.className,
      dbDynamicModule.inlineCss,
      picture,
      dbDynamicModule.url,
      dbDynamicModule.createdAt,
      dbDynamicModule.updatedAt
    );
    return domainDynamicModule;
  }

  dbToDomain(dbDynamicModule: DynamicModulePG): DynamicModule {
    return DynamicModuleMapper.dbToDomain(dbDynamicModule);
  }

  public static dtToDomain(dynamicModuleDT: DynamicModuleDT): DynamicModule {
    const locString = dynamicModuleDT.locString
      ? LocStringMapper.dtToDomain(dynamicModuleDT.locString)
      : undefined;

    const picture = dynamicModuleDT.picture
      ? PictureMapper.dtToDomain(dynamicModuleDT.picture)
      : undefined;

    const domainDynamicModule = new DynamicModule(
      dynamicModuleDT.id,
      dynamicModuleDT.moduleType,
      dynamicModuleDT.page,
      dynamicModuleDT.placement,
      dynamicModuleDT.placementType,
      locString,
      dynamicModuleDT.className,
      dynamicModuleDT.inlineCss,
      picture,
      dynamicModuleDT.url,
      // timestamps are not accepted from frontend
      // dynamicModuleDT.createdAt,
      // dynamicModuleDT.updatedAt
    );
    return domainDynamicModule;
  }
  
  dtToDomain(dynamicModuleDT: DynamicModuleDT): DynamicModule {
    return DynamicModuleMapper.dtToDomain(dynamicModuleDT);
  }

  public static domainToDT(domainDynamicModule: DynamicModule): DynamicModuleDT {
    const locString = domainDynamicModule.locString
      ? LocStringMapper.domainToDT(domainDynamicModule.locString)
      : undefined;

    const picture = domainDynamicModule.picture
      ? PictureMapper.domainToDT(domainDynamicModule.picture)
      : undefined;

    const dynamicModuleDT: DynamicModuleDT = {
      id: domainDynamicModule.id,
      moduleType: domainDynamicModule.moduleType,
      page: domainDynamicModule.page,
      placement: domainDynamicModule.placement,
      placementType: domainDynamicModule.placementType,
      locString,
      className: domainDynamicModule.className,
      inlineCss: domainDynamicModule.inlineCss,
      picture,
      url: domainDynamicModule.url,
      createdAt: toOptionalISOString(domainDynamicModule.createdAt),
      updatedAt: toOptionalISOString(domainDynamicModule.updatedAt)
    };
    return dynamicModuleDT;
  }

  domainToDT(domainDynamicModule: DynamicModule): DynamicModuleDT {
    return DynamicModuleMapper.domainToDT(domainDynamicModule);
  }

}