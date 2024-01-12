import type { FoodInclude, IFoodRepo } from '../interfaces';
import type { FoodDTN, FoodType, LocString } from '@m-market-app/models';
import type { Transaction, Includeable } from 'sequelize';
import { Food } from '@m-market-app/models';
import {
  Food as FoodPG,
  includeFoodComponents,
  includeDescriptionLoc,
  includeFoodMainPicture,
  includeFoodGallery,
  includeNameLoc
} from '@m-market-app/db';
import { FoodMapper } from '../infrastructure';
import { DatabaseError } from '@m-market-app/utils';

export class FoodRepoSequelizePG implements IFoodRepo {

  async getAll(): Promise<Food[]> {
    const dbFoods = await FoodPG.scope('all').findAll();
    return dbFoods.map(food => FoodMapper.dbToDomain(food));
  }

  async getById(id: number): Promise<Food> {
    const dbFood = await FoodPG.scope('allWithTimestamps').findByPk(id);
    if (!dbFood) throw new DatabaseError(`No food entry with this id ${id}`);
    return FoodMapper.dbToDomain(dbFood);
  }

  async getManySortedByIds(ids: number[]): Promise<Food[]> {
    const dbFoods = await FoodPG.scope('allWithTimestamps').findAll({
      where: { id: ids },
      order: [['id', 'ASC']]
    });
    return dbFoods.map(food => FoodMapper.dbToDomain(food));
  }

  async getByIdWithAssociations(
    id: number,
    include: FoodInclude
  ): Promise<Food> {

    const includeClause: Includeable[] = [ includeNameLoc, includeDescriptionLoc ];

    if (include.components) {
      includeClause.push(includeFoodComponents);
    }

    if (include.mainPicture) {
      includeClause.push(includeFoodMainPicture);
    }

    if (include.gallery) {
      includeClause.push(includeFoodGallery);
    }

    const dbFood = await FoodPG.scope('all').findByPk(id, {
      include: includeClause
    });
    if (!dbFood) throw new DatabaseError(`No food entry with this id ${id}`);

    return FoodMapper.dbToDomain(dbFood);
  }

  async getSomeWithAssociations(
    include: FoodInclude,
    limit?: number,
    offset?: number,
    foodTypeId?: number
  ): Promise<Food[]> {

    const includeClause: Includeable[] = [ includeNameLoc, includeDescriptionLoc ];

    if (include.components) {
      includeClause.push(includeFoodComponents);
    }

    if (include.mainPicture) {
      includeClause.push(includeFoodMainPicture);
    }

    if (include.gallery) {
      includeClause.push(includeFoodGallery);
    }

    const dbFoods = await FoodPG.scope('allWithComponents').findAll({
      where: foodTypeId ? { foodTypeId } : {},
      include: includeClause,
      limit,
      offset
    });
    
    return dbFoods.map(food => FoodMapper.dbToDomain(food));
  }

  async create(
    foodDTN: FoodDTN,
    nameLoc: LocString,
    descriptionLoc: LocString,
    foodType: FoodType,
    transaction?: Transaction
  ): Promise<Food> {

    const dbFood = await FoodPG.create({
      nameLocId: nameLoc.id,
      descriptionLocId: descriptionLoc.id,
      foodTypeId: foodDTN.foodTypeId,
      price: foodDTN.price
    }, {
      transaction
    });
  
    return new Food(
      dbFood.id,
      nameLoc,
      descriptionLoc,
      foodType,
      dbFood.price
    );

  }

  async update(updFood: Food, transaction?: Transaction): Promise<Food> {

    const [ count, updated ] = await FoodPG.update({
      foodTypeId: updFood.foodType.id,
      price: updFood.price
    }, {
      where: {
        id: updFood.id
      },
      transaction,
      returning: true
    });

    if (count === 0) {
      throw new DatabaseError(`No food type entry with this id ${updFood.id}`);
    }

    // NameLoc and DescriptionLoc are already updated here
    return new Food(
      updated[0].id,
      updFood.nameLoc,
      updFood.descriptionLoc,
      updFood.foodType,
      updated[0].price
    );
  }

  async remove(id: number, transaction?: Transaction): Promise<void> {
    const dbFood = await FoodPG.scope('raw').findByPk(id);
    if (!dbFood) throw new DatabaseError(`No food type entry with this id ${id}`);
    await dbFood.destroy({ transaction });
  }

  async removeAll(): Promise<void> {
    await FoodPG.scope('all').destroy({ force: true, where: {} });
  }
}