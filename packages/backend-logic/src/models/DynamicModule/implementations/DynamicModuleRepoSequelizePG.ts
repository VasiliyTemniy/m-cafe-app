import type { IDynamicModuleRepo } from '../interfaces';
import type { DynamicModule, DynamicModuleDTN, LocString } from '@m-market-app/models';
import type { Transaction } from 'sequelize';
import { DynamicModule as DynamicModulePG } from '@m-market-app/db';
import { DynamicModuleMapper } from '../infrastructure';
import { DatabaseError } from '@m-market-app/utils';


export class DynamicModuleRepoSequelizePG implements IDynamicModuleRepo {
  
  async getAll(): Promise<DynamicModule[]> {
    const dbDynamicModules = await DynamicModulePG.scope('all').findAll();
    return dbDynamicModules.map(dynamicModule => DynamicModuleMapper.dbToDomain(dynamicModule));
  }

  async getById(id: number): Promise<DynamicModule> {
    const dbDynamicModule = await DynamicModulePG.scope('all').findByPk(id);
    if (!dbDynamicModule) throw new DatabaseError(`No dynamic module entry with this id ${id}`);
    return DynamicModuleMapper.dbToDomain(dbDynamicModule);
  }

  async getAllByPage(page: string): Promise<DynamicModule[]> {
    const dbDynamicModules = await DynamicModulePG.scope('all').findAll({ where: { page } });
    return dbDynamicModules.map(dynamicModule => DynamicModuleMapper.dbToDomain(dynamicModule));
  }

  async create(dynamicModuleDTN: DynamicModuleDTN, locString?: LocString, transaction?: Transaction): Promise<DynamicModule> {
    const dbDynamicModule = await DynamicModulePG.create({
      moduleType: dynamicModuleDTN.moduleType,
      page: dynamicModuleDTN.page,
      placement: dynamicModuleDTN.placement,
      placementType: dynamicModuleDTN.placementType,
      className: dynamicModuleDTN.className,
      inlineCss: dynamicModuleDTN.inlineCss,
      url: dynamicModuleDTN.url,
      locStringId: locString?.id
    }, {
      transaction
    });

    return DynamicModuleMapper.dbToDomain(dbDynamicModule);
  }

  async update(dynamicModule: DynamicModule, transaction?: Transaction): Promise<DynamicModule> {
    const [ count, updated ] = await DynamicModulePG.update({
      moduleType: dynamicModule.moduleType,
      page: dynamicModule.page,
      placement: dynamicModule.placement,
      placementType: dynamicModule.placementType,
      className: dynamicModule.className,
      inlineCss: dynamicModule.inlineCss,
      url: dynamicModule.url,
    }, {
      where: { id: dynamicModule.id },
      transaction,
      returning: true
    });

    if (count === 0) {
      throw new DatabaseError(`No dynamic module entry with this id ${dynamicModule.id}`);
    }

    return DynamicModuleMapper.dbToDomain(updated[0]);
  }

  async remove(id: number, transaction?: Transaction): Promise<void> {
    await DynamicModulePG.destroy({
      where: { id },
      transaction
    });
  }

  async removeAll(): Promise<void> {
    await DynamicModulePG.scope('all').destroy({ force: true, where: {} });
  }

  async addLocString(id: number, locStringId: number, transaction?: Transaction): Promise<DynamicModule> {
    const [ count, updated ] = await DynamicModulePG.update({
      locStringId
    }, {
      where: { id },
      transaction,
      returning: true
    });
    
    if (count === 0) {
      throw new DatabaseError(`No dynamic module entry with this id ${id}`);
    }

    return DynamicModuleMapper.dbToDomain(updated[0]);
  }

  async removeLocString(id: number, transaction?: Transaction): Promise<DynamicModule> {
    const [ count, updated ] = await DynamicModulePG.update({
      locStringId: null
    }, {
      where: { id },
      transaction,
      returning: true
    });

    if (count === 0) {
      throw new DatabaseError(`No dynamic module entry with this id ${id}`);
    }

    return DynamicModuleMapper.dbToDomain(updated[0]);
  }

  async addPicture(id: number, pictureId: number, transaction?: Transaction): Promise<DynamicModule> {
    const [ count, updated ] = await DynamicModulePG.update({
      pictureId
    }, {
      where: { id },
      transaction,
      returning: true
    });

    if (count === 0) {
      throw new DatabaseError(`No dynamic module entry with this id ${id}`);
    }

    return DynamicModuleMapper.dbToDomain(updated[0]);
  }

  async removePicture(id: number, transaction?: Transaction): Promise<DynamicModule> {
    const [ count, updated ] = await DynamicModulePG.update({
      pictureId: null
    }, {
      where: { id },
      transaction,
      returning: true
    });
    
    if (count === 0) {
      throw new DatabaseError(`No dynamic module entry with this id ${id}`);
    }

    return DynamicModuleMapper.dbToDomain(updated[0]);
  }

}