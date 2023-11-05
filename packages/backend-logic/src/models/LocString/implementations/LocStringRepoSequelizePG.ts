import type { ILocStringRepo } from '../interfaces';
import type { LocStringDTN } from '@m-cafe-app/models';
import type { IDatabaseConnectionHandler } from '@m-cafe-app/db';
import type { Sequelize } from 'sequelize';
import { LocString } from '@m-cafe-app/models';
import { LocString as LocStringPG } from '@m-cafe-app/db';
import { LocStringMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';

export class LocStringRepoSequelizePG implements ILocStringRepo {

  private dbInstance: Sequelize;

  constructor( readonly dbHandler: IDatabaseConnectionHandler ) {
    if (!dbHandler.dbInstance) {
      throw new DatabaseError('No database connection');
    }
    this.dbInstance = dbHandler.dbInstance;
  }

  async getAll(): Promise<LocString[]> {
    const dbLocStrings = await LocStringPG.scope('all').findAll();
    return dbLocStrings.map(locString => LocStringMapper.dbToDomain(locString));
  }

  async getById(id: number): Promise<LocString> {
    const dbLocString = await LocStringPG.scope('allWithTimestamps').findByPk(id);
    if (!dbLocString) throw new DatabaseError(`No food type entry with this id ${id}`);
    return LocStringMapper.dbToDomain(dbLocString);
  }

  async create(locStringDTN: LocStringDTN): Promise<LocString> {
    const savedLocString = await LocStringPG.create({
      mainStr: locStringDTN.mainStr,
      secStr: locStringDTN.secStr,
      altStr: locStringDTN.altStr
    });

    return LocStringMapper.dbToDomain(savedLocString);
  }

  async update(locString: LocString): Promise<LocString> {
    const updatedLocString = await this.dbInstance.transaction(async (t) => {
      const [ count, updated ] = await LocStringPG.update({
        mainStr: locString.mainStr,
        secStr: locString.secStr,
        altStr: locString.altStr
      },
      {
        where: { id: locString.id },
        transaction: t,
        returning: true
      });
      if (count === 0) {
        await t.rollback();
        throw new DatabaseError(`No loc string entry with this id ${locString.id}`);
      }

      return LocStringMapper.dbToDomain(updated[0]);
    });

    return updatedLocString;
  }

  async remove(id: number): Promise<void> {
    const deletedCount = await LocStringPG.destroy({ where: { id } });
    if (deletedCount === 0) throw new DatabaseError(`No loc string entry with this id ${id}`);
  }

  async removeAll(): Promise<void> {
    await LocStringPG.scope('all').destroy({ force: true, where: {} });
  }
}