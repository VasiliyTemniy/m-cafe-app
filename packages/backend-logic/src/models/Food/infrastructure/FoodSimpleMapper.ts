import type { EntitySimpleMapper } from '../../../utils';
import type { FoodDTS } from '@m-cafe-app/models';
import { Food, FoodS } from '@m-cafe-app/models';
import { Food as FoodPG } from '@m-cafe-app/db';
import { ApplicationError } from '@m-cafe-app/utils';
import { LocStringMapper } from '../../LocString';


export class FoodSimpleMapper implements EntitySimpleMapper<Food, FoodS, FoodPG, FoodDTS> {

  public static domainToSimple(domainFood: Food): FoodS {
    const foodS: FoodS = {
      id: domainFood.id,
      nameLoc: domainFood.nameLoc
    };
    return foodS;
  }

  domainToSimple(domainFood: Food): FoodS {
    return FoodSimpleMapper.domainToSimple(domainFood);
  }

  public static dbToSimple(dbFood: FoodPG): FoodS {
    if (!dbFood.nameLoc)
      throw new ApplicationError('Food data corrupt: nameLoc is missing check for wrong db include clause');

    const foodS = new FoodS(
      dbFood.id,
      LocStringMapper.dbToDomain(dbFood.nameLoc)
    );

    return foodS;
  }

  dbToSimple(dbFood: FoodPG): FoodS {
    return FoodSimpleMapper.dbToSimple(dbFood);
  }

  public static dtsToSimple(foodDTS: FoodDTS): FoodS {
    const foodS: FoodS = {
      id: foodDTS.id,
      nameLoc: LocStringMapper.dtToDomain(foodDTS.nameLoc)
    };
    return foodS;
  }

  dtsToSimple(foodDTS: FoodDTS): FoodS {
    return FoodSimpleMapper.dtsToSimple(foodDTS);
  }

  public static simpleToDTS(foodS: FoodS): FoodDTS {
    const foodDTS: FoodDTS = {
      id: foodS.id,
      nameLoc: LocStringMapper.domainToDT(foodS.nameLoc)
    };
    return foodDTS;
  }

  simpleToDTS(foodS: FoodS): FoodDTS {
    return FoodSimpleMapper.simpleToDTS(foodS);
  }

}