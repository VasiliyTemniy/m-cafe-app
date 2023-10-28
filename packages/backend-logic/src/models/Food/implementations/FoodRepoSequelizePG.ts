import type { IFoodRepo } from '../interfaces';
import type { FoodDTN } from '@m-cafe-app/models';
import { Food } from '@m-cafe-app/models';
import { Food as FoodPG, LocString as LocStringPG, FoodType as FoodTypePG } from '@m-cafe-app/db';
import { FoodMapper } from '../infrastructure';
import { ApplicationError, DatabaseError } from '@m-cafe-app/utils';
import { LocStringMapper } from '../../LocString';
import { FoodTypeMapper } from '../../FoodType';

export class FoodRepoSequelizePG implements IFoodRepo {
  async getAll(): Promise<Food[]> {
    const dbFoods = await FoodPG.scope('all').findAll();
    return dbFoods.map(food => FoodMapper.dbToDomain(food));
  }

  async getById(id: number): Promise<Food> {
    const dbFood = await FoodPG.scope('allWithTimestamps').findByPk(id);
    if (!dbFood) throw new DatabaseError(`No food type entry with this id ${id}`);
    return FoodMapper.dbToDomain(dbFood);
  }

  async create(foodDTN: FoodDTN): Promise<Food> {

    const existingFoodType = await FoodTypePG.scope('raw').findByPk(foodDTN.foodTypeId);
    if (!existingFoodType) throw new DatabaseError(`No food type entry with this id ${foodDTN.foodTypeId}`); 

    const dbNameLoc = await LocStringPG.create({
      mainStr: foodDTN.nameLoc.mainStr,
      secStr: foodDTN.nameLoc.secStr,
      altStr: foodDTN.nameLoc.altStr
    });
    const dbDescriptionLoc = await LocStringPG.create({
      mainStr: foodDTN.descriptionLoc.mainStr,
      secStr: foodDTN.descriptionLoc.secStr,
      altStr: foodDTN.descriptionLoc.altStr
    });

    const dbFood = await FoodPG.create({
      nameLocId: dbNameLoc.id,
      descriptionLocId: dbDescriptionLoc.id,
      foodTypeId: foodDTN.foodTypeId,
      price: foodDTN.price
    });

    return FoodMapper.dbToDomain(dbFood);
  }

  async update(food: Food): Promise<Food> {
    const dbFood = await FoodPG.scope('raw').findByPk(food.id);
    if (!dbFood) throw new DatabaseError(`No food type entry with this id ${food.id}; reinit food types.`);
    if (!dbFood.foodType) throw new ApplicationError(`No food type property: check for wrong db include clause`);

    const existingFoodType = await FoodTypePG.scope('raw').findByPk(food.foodType.id);
    if (!existingFoodType) throw new DatabaseError(`No food type entry with this id ${food.foodType.id}`); 

    const dbNameLoc = await LocStringPG.scope('all').findByPk(food.nameLoc.id);
    if (!dbNameLoc) throw new DatabaseError(`No name loc entry with this id ${food.nameLoc.id}; reinit food types.`);

    const dbDescriptionLoc = await LocStringPG.scope('all').findByPk(food.descriptionLoc.id);
    if (!dbDescriptionLoc) throw new DatabaseError(`No description loc entry with this id ${food.descriptionLoc.id}; reinit food types.`);
    
    dbNameLoc.mainStr = food.nameLoc.mainStr;
    dbNameLoc.secStr = food.nameLoc.secStr;
    dbNameLoc.altStr = food.nameLoc.altStr;

    const updatedNameLoc = await dbNameLoc.save();

    dbDescriptionLoc.mainStr = food.descriptionLoc.mainStr;
    dbDescriptionLoc.secStr = food.descriptionLoc.secStr;
    dbDescriptionLoc.altStr = food.descriptionLoc.altStr;

    const updatedDescriptionLoc = await dbDescriptionLoc.save();

    return new Food(
      food.id,
      LocStringMapper.dbToDomain(updatedNameLoc),
      LocStringMapper.dbToDomain(updatedDescriptionLoc),
      FoodTypeMapper.dbToDomain(dbFood.foodType),
      food.price
    );
  }

  async remove(id: number): Promise<void> {
    const dbFood = await FoodPG.scope('raw').findByPk(id);
    if (!dbFood) throw new DatabaseError(`No food type entry with this id ${id}`);

    await LocStringPG.scope('all').destroy({ where: { id: dbFood.nameLocId } });
    await LocStringPG.scope('all').destroy({ where: { id: dbFood.descriptionLocId } });

    await dbFood.destroy();
  }

  async removeAll(): Promise<void> {
    await FoodPG.scope('all').destroy({ force: true, where: {} });
  }
}