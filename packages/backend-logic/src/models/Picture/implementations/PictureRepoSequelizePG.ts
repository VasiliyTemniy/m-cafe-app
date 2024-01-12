import type { LocString, Picture } from '@m-cafe-app/models';
import type { IPictureRepo } from '../interfaces';
import type { Transaction } from 'sequelize';
import { Picture as PicturePG } from '@m-cafe-app/db';
import { PictureMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';


export class PictureRepoSequelizePG implements IPictureRepo {

  async getAll(): Promise<Picture[]> {
    const dbPictures = await PicturePG.scope('all').findAll();
    return dbPictures.map(dbPicture => PictureMapper.dbToDomain(dbPicture));
  }

  async getById(id: number): Promise<Picture> {
    const dbPicture = await PicturePG.scope('allWithTimestamps').findByPk(id);
    if (!dbPicture) throw new DatabaseError(`No picture entry with this id ${id}`);
    return PictureMapper.dbToDomain(dbPicture);
  }

  async create(src: string, altTextLoc: LocString, transaction?: Transaction): Promise<Picture> {

    const dbPicture = await PicturePG.create({
      src,
      altTextLocId: altTextLoc.id
    }, {
      transaction
    });

    return PictureMapper.dbToDomain(dbPicture);
  }

  async update(id: number, src: string, transaction?: Transaction): Promise<Picture> {
    
    const [ count, updated ] = await PicturePG.update({
      src
    }, {
      where: { id },
      transaction,
      returning: true
    });

    if (count === 0) {
      throw new DatabaseError(`No picture entry with this id ${id}`);
    }

    return PictureMapper.dbToDomain(updated[0]);
  }

  async remove(id: number, transaction?: Transaction): Promise<void> {
    const deletedCount = await PicturePG.scope('raw').destroy({
      where: { id },
      transaction
    });

    if (deletedCount === 0) {
      throw new DatabaseError(`No picture entry with this id ${id}`);
    }
  }

  async removeAll(): Promise<void> {
    await PicturePG.scope('raw').destroy({ force: true, where: {} });
  }

  async removeWithCount(ids: number[], transaction?: Transaction): Promise<number> {
    return await PicturePG.scope('raw').destroy({ where: { id: ids }, transaction });
  }

}