import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import type { FoodTypeDT } from '@m-market-app/models';
import { FoodType } from '@m-market-app/models';
import { FoodType as FoodTypePG } from '@m-market-app/db';
import { ApplicationError, toOptionalISOString } from '@m-market-app/utils';
import { LocStringMapper } from '../../LocString';


export class FoodTypeMapper implements EntityDBMapper<FoodType, FoodTypePG>, EntityDTMapper<FoodType, FoodTypeDT> {

  public static dbToDomain(dbFoodType: FoodTypePG): FoodType {
    if (!dbFoodType.nameLoc || !dbFoodType.descriptionLoc)
      throw new ApplicationError('FoodType data corrupt: nameLoc or descriptionLoc is missing check for wrong db include clause');

    const domainFoodType = new FoodType(
      dbFoodType.id,
      LocStringMapper.dbToDomain(dbFoodType.nameLoc),
      LocStringMapper.dbToDomain(dbFoodType.descriptionLoc),
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
      LocStringMapper.dtToDomain(foodTypeDT.nameLoc),
      LocStringMapper.dtToDomain(foodTypeDT.descriptionLoc)
    );
    return domainFoodType;
  }
  
  dtToDomain(foodTypeDT: FoodTypeDT): FoodType {
    return FoodTypeMapper.dtToDomain(foodTypeDT);
  }

  public static domainToDT(domainFoodType: FoodType): FoodTypeDT {
    const foodTypeDT: FoodTypeDT = {
      id: domainFoodType.id,
      nameLoc: LocStringMapper.domainToDT(domainFoodType.nameLoc),
      descriptionLoc: LocStringMapper.domainToDT(domainFoodType.descriptionLoc),
      createdAt: toOptionalISOString(domainFoodType.createdAt),
      updatedAt: toOptionalISOString(domainFoodType.updatedAt)
    };
    return foodTypeDT;
  }

  domainToDT(domainFoodType: FoodType): FoodTypeDT {
    return FoodTypeMapper.domainToDT(domainFoodType);
  }

}