import type { FixedLoc, FixedLocDTN, FixedLocUniquePropertiesGroup } from '@m-cafe-app/models';
import type { IFixedLocRepo } from '../interfaces';
import { DatabaseError } from '@m-cafe-app/utils';
import { FixedLocMapper } from '../infrastructure';
import { FixedLoc as FixedLocPG, LocString as LocStringPG } from '@m-cafe-app/db';

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

  async getByUniqueProperties(properties: FixedLocUniquePropertiesGroup): Promise<FixedLoc> {
    const dbFixedLoc = await FixedLocPG.scope('all').findOne({ where: properties });
    if (!dbFixedLoc) throw new DatabaseError(`No fixed loc entry with this id ${properties}`);
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
  async update(fixedLoc: FixedLoc): Promise<FixedLoc> {
    const dbLocString = await LocStringPG.scope('all').findByPk(fixedLoc.locString.id);
    if (!dbLocString) throw new DatabaseError(`No loc string entry with this id ${fixedLoc.locString.id}; reinit fixed locs.`);
    
    dbLocString.mainStr = fixedLoc.locString.mainStr;
    dbLocString.secStr = fixedLoc.locString.secStr;
    dbLocString.altStr = fixedLoc.locString.altStr;

    await dbLocString.save();
    return fixedLoc;
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