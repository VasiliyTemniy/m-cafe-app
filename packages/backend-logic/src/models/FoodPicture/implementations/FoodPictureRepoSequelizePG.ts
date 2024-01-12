import type { FoodPicture, FoodPictureDTNU } from '@m-market-app/models';
import type { IFoodPictureRepo } from '../interfaces';
import type { Transaction } from 'sequelize';
import { FoodPicture as FoodPicturePG } from '@m-market-app/db';
import { FoodPictureMapper } from '../infrastructure';
import { DatabaseError } from '@m-market-app/utils';


export class FoodPictureRepoSequelizePG implements IFoodPictureRepo {

  async getAllByFoodId(foodId: number): Promise<FoodPicture[]> {
    const dbFoodPictures = await FoodPicturePG.scope('orderedWithPicture').findAll({
      where: {
        foodId
      }
    });
    return dbFoodPictures.map(foodPicture => FoodPictureMapper.dbToDomain(foodPicture));
  }

  async getMainPictureByFoodId(foodId: number): Promise<FoodPicture> {
    const dbFoodPicture = await FoodPicturePG.scope('orderedWithPicture').findOne({
      where: {
        foodId,
        orderNumber: 0
      },
    });
    if (!dbFoodPicture) {
      throw new DatabaseError(`No main picture for food with id ${foodId}`);
    }
    return FoodPictureMapper.dbToDomain(dbFoodPicture);
  }

  async create(foodPictureDTNU: FoodPictureDTNU, transaction?: Transaction): Promise<FoodPicture> {
    const dbFoodPicture = await FoodPicturePG.create({
      foodId: foodPictureDTNU.foodId,
      pictureId: foodPictureDTNU.pictureId,
      orderNumber: foodPictureDTNU.orderNumber
    }, {
      transaction
    });

    return FoodPictureMapper.dbToDomain(dbFoodPicture);
  }

  async update(foodPictureDTNU: FoodPictureDTNU, transaction?: Transaction): Promise<FoodPicture> {
    const [ count, updated ] = await FoodPicturePG.update({
      orderNumber: foodPictureDTNU.orderNumber
    }, {
      where: {
        foodId: foodPictureDTNU.foodId,
        pictureId: foodPictureDTNU.pictureId
      },
      returning: true,
      transaction
    });

    if (count === 0) {
      throw new DatabaseError(`No food picture with these ids: foodId: ${foodPictureDTNU.foodId}, pictureId: ${foodPictureDTNU.pictureId}`);
    }

    return FoodPictureMapper.dbToDomain(updated[0]);
  }

  async remove(foodId: number, pictureId: number, transaction?: Transaction): Promise<number> {
    const count = await FoodPicturePG.destroy({
      where: {
        foodId,
        pictureId
      },
      transaction
    });
    
    return count;
  }

  async removeByFoodId(foodId: number, transaction?: Transaction): Promise<number> {
    const count = await FoodPicturePG.destroy({
      where: {
        foodId
      },
      transaction
    });

    return count;
  }

  async removeAll(): Promise<void> {
    await FoodPicturePG.scope('raw').destroy({ force: true, where: {} });
  }
}