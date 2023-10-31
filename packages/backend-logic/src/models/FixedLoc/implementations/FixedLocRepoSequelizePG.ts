import type { FixedLocDTN, FixedLocUniquePropertiesGroup } from '@m-cafe-app/models';
import type { IFixedLocRepo } from '../interfaces';
import type { IDatabaseConnectionHandler } from '@m-cafe-app/db';
import type { Sequelize } from 'sequelize';
import type { ILocStringRepo } from '../../LocString';
import { DatabaseError } from '@m-cafe-app/utils';
import { FixedLocMapper } from '../infrastructure';
import { FixedLoc as FixedLocPG, LocString as LocStringPG } from '@m-cafe-app/db';
import { FixedLoc } from '@m-cafe-app/models';

export class FixedLocRepoSequelizePG implements IFixedLocRepo {

  private dbInstance: Sequelize;

  constructor(
    readonly dbHandler: IDatabaseConnectionHandler,
    readonly locStringRepo: ILocStringRepo
  ) {
    if (!dbHandler.dbInstance) {
      throw new DatabaseError('No database connection');
    }
    this.dbInstance = dbHandler.dbInstance;
  }

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

  /**
   * Should not be used, left here for consistency
   * and unforseen purposes
   */
  async create(fixedLocDTN: FixedLocDTN): Promise<FixedLoc> {
    const dbLocString = await LocStringPG.create(fixedLocDTN.locString);
    const dbFixedLoc = await FixedLocPG.create({
      name: fixedLocDTN.name,
      namespace: fixedLocDTN.namespace,
      scope: fixedLocDTN.scope,
      locStringId: dbLocString.id
    });

    dbFixedLoc.locString = dbLocString;

    return FixedLocMapper.dbToDomain(dbFixedLoc);
  }

  /**
   * Updates only locString, other fields are not changed
   */
  async update(fixedLocToUpd: FixedLoc): Promise<FixedLoc> {
    const updatedFixedLoc = await this.dbInstance.transaction(async (t) => {

      const dbFixedLoc = await FixedLocPG.scope('raw').findByPk(fixedLocToUpd.id);
      if (!dbFixedLoc) {
        await t.rollback();
        throw new DatabaseError(`No fixed loc entry with this id ${fixedLocToUpd.id}`);
      }
      const updatedLocString = await this.locStringRepo.update(fixedLocToUpd.locString);

      return new FixedLoc(
        dbFixedLoc.id,
        dbFixedLoc.name,
        dbFixedLoc.namespace,
        dbFixedLoc.scope,
        updatedLocString
      );
    });

    return updatedFixedLoc;
  }

  async updateMany(fixedLocs: FixedLoc[]): Promise<FixedLoc[]> {
    return await Promise.all(fixedLocs.map(fixedLoc => this.update(fixedLoc)));
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