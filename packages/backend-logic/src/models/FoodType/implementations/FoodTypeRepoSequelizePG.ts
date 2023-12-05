import type { IFoodTypeRepo } from '../interfaces';
import type { FoodTypeDTN, LocString } from '@m-cafe-app/models';
import type { Transaction } from 'sequelize';
import { FoodType } from '@m-cafe-app/models';
import { FoodType as FoodTypePG } from '@m-cafe-app/db';
import { FoodTypeMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';

export class FoodTypeRepoSequelizePG implements IFoodTypeRepo {

  async getAll(withFoodOnly: boolean): Promise<FoodType[]> {

    const scope = withFoodOnly
      ? 'allWithFood'
      : 'all';

    const dbFoodTypes = await FoodTypePG.scope(scope).findAll();
    return dbFoodTypes.map(foodType => FoodTypeMapper.dbToDomain(foodType));
  }

  async getById(id: number): Promise<FoodType> {
    const dbFoodType = await FoodTypePG.scope('allWithTimestamps').findByPk(id);
    if (!dbFoodType) throw new DatabaseError(`No food type entry with this id ${id}`);
    return FoodTypeMapper.dbToDomain(dbFoodType);
  }

  async create(
    foodTypeDTN: FoodTypeDTN,
    nameLoc: LocString,
    descriptionLoc: LocString,
    transaction?: Transaction
  ): Promise<FoodType> {
  
    const dbFoodType = await FoodTypePG.create({
      nameLocId: nameLoc.id,
      descriptionLocId: descriptionLoc.id
    }, {
      transaction
    });
  
    return new FoodType(
      dbFoodType.id,
      nameLoc,
      descriptionLoc
    );
  }

  async remove(id: number, transaction?: Transaction): Promise<void> {
    const dbFoodType = await FoodTypePG.scope('raw').findByPk(id);
    if (!dbFoodType) throw new DatabaseError(`No food type entry with this id ${id}`);
    await dbFoodType.destroy({ transaction });
  }

  async removeAll(): Promise<void> {
    await FoodTypePG.scope('all').destroy({ force: true, where: {} });
  }
}