import type { ILocStringRepo } from '../interfaces';
import type { LocStringDTN } from '@m-market-app/models';
import type { Transaction } from 'sequelize';
import { LocString } from '@m-market-app/models';
import { LocString as LocStringPG } from '@m-market-app/db';
import { LocStringMapper } from '../infrastructure';
import { DatabaseError } from '@m-market-app/utils';

export class LocStringRepoSequelizePG implements ILocStringRepo {

  async getAll(): Promise<LocString[]> {
    const dbLocStrings = await LocStringPG.scope('all').findAll();
    return dbLocStrings.map(locString => LocStringMapper.dbToDomain(locString));
  }

  async getById(id: number): Promise<LocString> {
    const dbLocString = await LocStringPG.scope('allWithTimestamps').findByPk(id);
    if (!dbLocString) throw new DatabaseError(`No food type entry with this id ${id}`);
    return LocStringMapper.dbToDomain(dbLocString);
  }

  async create(locStringDTN: LocStringDTN, transaction?: Transaction): Promise<LocString> {
    const createdLocString = await LocStringPG.create({
      mainStr: locStringDTN.mainStr,
      secStr: locStringDTN.secStr,
      altStr: locStringDTN.altStr
    }, {
      transaction
    });


    return LocStringMapper.dbToDomain(createdLocString);
  }

  async update(locString: LocString, transaction?: Transaction): Promise<LocString> {
    const [ count, updated ] = await LocStringPG.update({
      mainStr: locString.mainStr,
      secStr: locString.secStr,
      altStr: locString.altStr
    },
    {
      where: { id: locString.id },
      transaction,
      returning: true
    });

    if (count === 0) {
      throw new DatabaseError(`No loc string entry with this id ${locString.id}`);
    }

    return LocStringMapper.dbToDomain(updated[0]);
  }

  async remove(id: number, transaction?: Transaction): Promise<void> {
    const deletedCount = await LocStringPG.destroy({ where: { id }, transaction });
    if (deletedCount === 0) throw new DatabaseError(`No loc string entry with this id ${id}`);
  }

  async removeWithCount(ids: number[], transaction?: Transaction): Promise<number> {
    return await LocStringPG.destroy({ where: { id: ids }, transaction });
  }

  async removeAll(): Promise<void> {
    await LocStringPG.scope('all').destroy({ force: true, where: {} });
  }
}