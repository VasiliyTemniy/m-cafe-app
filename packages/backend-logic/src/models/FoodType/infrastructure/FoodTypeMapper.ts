import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import type { FoodTypeDT } from '@m-cafe-app/models';
import { FoodType } from '@m-cafe-app/models';
import { FoodType as FoodTypePG } from '@m-cafe-app/db';
import { ApplicationError, toOptionalISOString } from '@m-cafe-app/utils';


export class FoodTypeMapper implements EntityDBMapper<FoodType, FoodTypePG>, EntityDTMapper<FoodType, FoodTypeDT> {

  public static dbToDomain(dbFoodType: FoodTypePG): FoodType {
    if (!dbFoodType.nameLoc || !dbFoodType.descriptionLoc)
      throw new ApplicationError('FoodType data corrupt: nameLoc or descriptionLoc is missing check for wrong db include clause');

    const domainFoodType = new FoodType(
      dbFoodType.id,
      {
        id: dbFoodType.nameLoc.id,
        mainStr: dbFoodType.nameLoc.mainStr,
        secStr: dbFoodType.nameLoc.secStr,
        altStr: dbFoodType.nameLoc.altStr,
        createdAt: dbFoodType.nameLoc.createdAt,
        updatedAt: dbFoodType.nameLoc.updatedAt
      },
      {
        id: dbFoodType.descriptionLoc.id,
        mainStr: dbFoodType.descriptionLoc.mainStr,
        secStr: dbFoodType.descriptionLoc.secStr,
        altStr: dbFoodType.descriptionLoc.altStr,
        createdAt: dbFoodType.descriptionLoc.createdAt,
        updatedAt: dbFoodType.descriptionLoc.updatedAt
      },
      dbFoodType.createdAt,
      dbFoodType.updatedAt
    );
    return domainFoodType;
  }

  dbToDomain(dbFoodType: FoodTypePG): FoodType {
    return FoodTypeMapper.dbToDomain(dbFoodType);
  }

  public static dtToDomain(foodTypeDT: FoodTypeDT): FoodType {
    const domainFoodType = new FoodType(
      foodTypeDT.id,
      {
        id: foodTypeDT.nameLoc.id,
        mainStr: foodTypeDT.nameLoc.mainStr,
        secStr: foodTypeDT.nameLoc.secStr,
        altStr: foodTypeDT.nameLoc.altStr,
      },
      {
        id: foodTypeDT.descriptionLoc.id,
        mainStr: foodTypeDT.descriptionLoc.mainStr,
        secStr: foodTypeDT.descriptionLoc.secStr,
        altStr: foodTypeDT.descriptionLoc.altStr,
      }
    );
    return domainFoodType;
  }
  
  dtToDomain(foodTypeDT: FoodTypeDT): FoodType {
    return FoodTypeMapper.dtToDomain(foodTypeDT);
  }

  public static domainToDT(domainFoodType: FoodType): FoodTypeDT {
    const foodTypeDT: FoodTypeDT = {
      id: domainFoodType.id,
      nameLoc: {
        id: domainFoodType.nameLoc.id,
        mainStr: domainFoodType.nameLoc.mainStr,
        secStr: domainFoodType.nameLoc.secStr,
        altStr: domainFoodType.nameLoc.altStr,
        createdAt: toOptionalISOString(domainFoodType.nameLoc.createdAt),
        updatedAt: toOptionalISOString(domainFoodType.nameLoc.updatedAt)
      },
      descriptionLoc: {
        id: domainFoodType.descriptionLoc.id,
        mainStr: domainFoodType.descriptionLoc.mainStr,
        secStr: domainFoodType.descriptionLoc.secStr,
        altStr: domainFoodType.descriptionLoc.altStr,
        createdAt: toOptionalISOString(domainFoodType.descriptionLoc.createdAt),
        updatedAt: toOptionalISOString(domainFoodType.descriptionLoc.updatedAt)
      },
      createdAt: toOptionalISOString(domainFoodType.createdAt),
      updatedAt: toOptionalISOString(domainFoodType.updatedAt)
    };
    return foodTypeDT;
  }

  domainToDT(domainFoodType: FoodType): FoodTypeDT {
    return FoodTypeMapper.domainToDT(domainFoodType);
  }

}