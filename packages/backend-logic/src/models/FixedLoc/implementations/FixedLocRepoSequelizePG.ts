import type { FixedLocDTN, FixedLocUniquePropertiesGroup, LocString } from '@m-cafe-app/models';
import type { IFixedLocRepo } from '../interfaces';
import type { Transaction } from 'sequelize';
import { DatabaseError } from '@m-cafe-app/utils';
import { FixedLocMapper } from '../infrastructure';
import { FixedLoc as FixedLocPG } from '@m-cafe-app/db';
import { FixedLoc } from '@m-cafe-app/models';

export class FixedLocRepoSequelizePG implements IFixedLocRepo {

  async getAll(): Promise<FixedLoc[]> {
    const dbFixedLocs = await FixedLocPG.scope('all').findAll();
    return dbFixedLocs.map(fixedLoc => FixedLocMapper.dbToDomain(fixedLoc));
  }

  async getByScope(scope: string = 'defaultScope'): Promise<FixedLoc[]> {
    const dbFixedLocs = await FixedLocPG.scope(scope).findAll();
    return dbFixedLocs.map(fixedLoc => FixedLocMapper.dbToDomain(fixedLoc));
  }

  async getById(id: number): Promise<FixedLoc> {
    const dbFixedLoc = await FixedLocPG.scope('all').findByPk(id);
    if (!dbFixedLoc) throw new DatabaseError(`No fixed loc entry with this id ${id}`);
    return FixedLocMapper.dbToDomain(dbFixedLoc);
  }

  async getByUniqueProperties(properties: FixedLocUniquePropertiesGroup): Promise<FixedLoc | undefined> {
    const dbFixedLoc = await FixedLocPG.scope('all').findOne({ where: properties });
    if (!dbFixedLoc) return undefined;
    return FixedLocMapper.dbToDomain(dbFixedLoc);
  }

  async create(fixedLocDTN: FixedLocDTN, locString: LocString, transaction?: Transaction): Promise<FixedLoc> {
    const dbFixedLoc = await FixedLocPG.create({
      name: fixedLocDTN.name,
      namespace: fixedLocDTN.namespace,
      scope: fixedLocDTN.scope,
      locStringId: locString.id
    }, {
      transaction
    });
  
    return new FixedLoc(
      dbFixedLoc.id,
      dbFixedLoc.name,
      dbFixedLoc.namespace,
      dbFixedLoc.scope,
      locString
    );
  }

  /**
   * Should not be used, left here for consistency
   * and unforseen purposes
   */
  async remove(id: number): Promise<void> {
    const dbFixedLoc = await FixedLocPG.scope('all').findByPk(id);
    if (!dbFixedLoc) throw new DatabaseError(`No fixed loc entry with this id ${id}`);
    await dbFixedLoc.destroy({ force: true });
  }

  async removeAll(): Promise<void> {
    await FixedLocPG.scope('all').destroy({ force: true, where: {} });
  }

}