import type { IFoodTypeRepo } from '../interfaces';
import type { FoodTypeDTN } from '@m-cafe-app/models';
import { FoodType } from '@m-cafe-app/models';
import { FoodType as FoodTypePG, LocString as LocStringPG } from '@m-cafe-app/db';
import { FoodTypeMapper } from '../infrastructure';
import { DatabaseError } from '@m-cafe-app/utils';

export class FoodTypeRepoSequelizePG implements IFoodTypeRepo {
  async getAll(): Promise<FoodType[]> {
    const dbFoodTypes = await FoodTypePG.scope('all').findAll();
    return dbFoodTypes.map(foodType => FoodTypeMapper.dbToDomain(foodType));
  }

  async getById(id: number): Promise<FoodType> {
    const dbFoodType = await FoodTypePG.scope('allWithTimestamps').findByPk(id);
    if (!dbFoodType) throw new DatabaseError(`No food type entry with this id ${id}`);
    return FoodTypeMapper.dbToDomain(dbFoodType);
  }

  async create(foodTypeDTN: FoodTypeDTN): Promise<FoodType> {

    const dbNameLoc = await LocStringPG.create({
      mainStr: foodTypeDTN.nameLoc.mainStr,
      secStr: foodTypeDTN.nameLoc.secStr,
      altStr: foodTypeDTN.nameLoc.altStr
    });
    const dbDescriptionLoc = await LocStringPG.create({
      mainStr: foodTypeDTN.descriptionLoc.mainStr,
      secStr: foodTypeDTN.descriptionLoc.secStr,
      altStr: foodTypeDTN.descriptionLoc.altStr
    });

    const dbFoodType = await FoodTypePG.create({
      nameLocId: dbNameLoc.id,
      descriptionLocId: dbDescriptionLoc.id
    });

    return FoodTypeMapper.dbToDomain(dbFoodType);
  }

  async update(foodType: FoodType): Promise<FoodType> {
    const dbFoodType = await FoodTypePG.scope('raw').findByPk(foodType.id);
    if (!dbFoodType) throw new DatabaseError(`No food type entry with this id ${foodType.id}; reinit food types.`);

    const dbNameLoc = await LocStringPG.scope('all').findByPk(foodType.nameLoc.id);
    if (!dbNameLoc) throw new DatabaseError(`No name loc entry with this id ${foodType.nameLoc.id}; reinit food types.`);

    const dbDescriptionLoc = await LocStringPG.scope('all').findByPk(foodType.descriptionLoc.id);
    if (!dbDescriptionLoc) throw new DatabaseError(`No description loc entry with this id ${foodType.descriptionLoc.id}; reinit food types.`);
    
    dbNameLoc.mainStr = foodType.nameLoc.mainStr;
    dbNameLoc.secStr = foodType.nameLoc.secStr;
    dbNameLoc.altStr = foodType.nameLoc.altStr;

    const updatedNameLoc = await dbNameLoc.save();

    dbDescriptionLoc.mainStr = foodType.descriptionLoc.mainStr;
    dbDescriptionLoc.secStr = foodType.descriptionLoc.secStr;
    dbDescriptionLoc.altStr = foodType.descriptionLoc.altStr;

    const updatedDescriptionLoc = await dbDescriptionLoc.save();

    return new FoodType(
      foodType.id,
      {
        id: foodType.nameLoc.id,
        mainStr: updatedNameLoc.mainStr,
        secStr: updatedNameLoc.secStr,
        altStr: updatedNameLoc.altStr
      },
      {
        id: foodType.descriptionLoc.id,
        mainStr: updatedDescriptionLoc.mainStr,
        secStr: updatedDescriptionLoc.secStr,
        altStr: updatedDescriptionLoc.altStr
      }
    );
  }

  async remove(id: number): Promise<void> {
    const dbFoodType = await FoodTypePG.scope('raw').findByPk(id);
    if (!dbFoodType) throw new DatabaseError(`No food type entry with this id ${id}`);

    await LocStringPG.scope('all').destroy({ where: { id: dbFoodType.nameLocId } });
    await LocStringPG.scope('all').destroy({ where: { id: dbFoodType.descriptionLocId } });

    await dbFoodType.destroy();
  }

  async removeAll(): Promise<void> {
    await FoodTypePG.scope('all').destroy({ force: true, where: {} });
  }
}