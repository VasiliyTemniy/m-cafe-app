import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import type { FoodDT } from '@m-cafe-app/models';
import { Food } from '@m-cafe-app/models';
import { Food as FoodPG } from '@m-cafe-app/db';
import { ApplicationError, toOptionalISOString } from '@m-cafe-app/utils';
import { FoodTypeMapper } from '../../FoodType';
import { FoodComponentMapper } from '../../FoodComponent';
import { LocStringMapper } from '../../LocString';
import { FoodPictureMapper } from '../../FoodPicture';


export class FoodMapper implements EntityDBMapper<Food, FoodPG>, EntityDTMapper<Food, FoodDT> {

  public static dbToDomain(dbFood: FoodPG): Food {
    if (!dbFood.nameLoc || !dbFood.descriptionLoc)
      throw new ApplicationError('Food data corrupt: nameLoc or descriptionLoc is missing check for wrong db include clause');

    if (!dbFood.foodType)
      throw new ApplicationError('Food data corrupt: foodType is missing check for wrong db include clause');

    const foodComponents = dbFood.foodComponents
      ? dbFood.foodComponents.map(component => FoodComponentMapper.dbToDomain(component))
      : undefined;

    const gallery = dbFood.gallery
      ? dbFood.gallery.map(foodPicture => FoodPictureMapper.dbToDomain(foodPicture))
      : undefined;

    const mainPicture = gallery
      ? gallery[0]
      : undefined;

    const domainFood = new Food(
      dbFood.id,
      LocStringMapper.dbToDomain(dbFood.nameLoc),
      LocStringMapper.dbToDomain(dbFood.descriptionLoc),
      FoodTypeMapper.dbToDomain(dbFood.foodType),
      foodComponents,
      mainPicture,
      gallery,
      dbFood.createdAt,
      dbFood.updatedAt
    );
    return domainFood;
  }

  dbToDomain(dbFood: FoodPG): Food {
    return FoodMapper.dbToDomain(dbFood);
  }

  public static dtToDomain(foodDT: FoodDT): Food {
    const foodComponents = foodDT.foodComponents
      ? foodDT.foodComponents.map(component => FoodComponentMapper.dtToDomain(component))
      : undefined;

    const gallery = foodDT.gallery
      ? foodDT.gallery.map(foodPicture => FoodPictureMapper.dtToDomain(foodPicture))
      : undefined;

    const mainPicture = gallery
      ? gallery[0]
      : undefined;

    const domainFood = new Food(
      foodDT.id,
      LocStringMapper.dtToDomain(foodDT.nameLoc),
      LocStringMapper.dtToDomain(foodDT.descriptionLoc),
      FoodTypeMapper.dtToDomain(foodDT.foodType),
      foodComponents,
      mainPicture,
      gallery
      // timestamps are not accepted from frontend
      // foodDT.createdAt,
      // foodDT.updatedAt
    );
    return domainFood;
  }
  
  dtToDomain(foodDT: FoodDT): Food {
    return FoodMapper.dtToDomain(foodDT);
  }

  public static domainToDT(domainFood: Food): FoodDT {
    const foodComponents = domainFood.foodComponents
      ? domainFood.foodComponents.map(component => FoodComponentMapper.domainToDT(component))
      : undefined;

    const gallery = domainFood.gallery
      ? domainFood.gallery.map(foodPicture => FoodPictureMapper.domainToDT(foodPicture))
      : undefined;

    const mainPicture = gallery
      ? gallery[0]
      : undefined;

    const foodDT: FoodDT = {
      id: domainFood.id,
      nameLoc: LocStringMapper.domainToDT(domainFood.nameLoc),
      descriptionLoc: LocStringMapper.domainToDT(domainFood.descriptionLoc),
      foodType: FoodTypeMapper.domainToDT(domainFood.foodType),
      foodComponents,
      mainPicture,
      gallery,
      createdAt: toOptionalISOString(domainFood.createdAt),
      updatedAt: toOptionalISOString(domainFood.updatedAt)
    };
    return foodDT;
  }

  domainToDT(domainFood: Food): FoodDT {
    return FoodMapper.domainToDT(domainFood);
  }

}