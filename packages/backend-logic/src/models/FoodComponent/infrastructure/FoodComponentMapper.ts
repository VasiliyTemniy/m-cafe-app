import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import type { FoodComponentDT, FoodDTS, IngredientDTS } from '@m-cafe-app/models';
import { FoodComponent } from '@m-cafe-app/models';
import { FoodComponent as FoodComponentPG, Food as FoodPG, Ingredient as IngredientPG } from '@m-cafe-app/db';
import { ApplicationError, toOptionalISOString } from '@m-cafe-app/utils';
import { FoodSimpleMapper } from '../../Food/infrastructure';
import { IngredientSimpleMapper } from '../../Ingredient';


export class FoodComponentMapper implements
  EntityDBMapper<FoodComponent, FoodComponentPG>,
  EntityDTMapper<FoodComponent, FoodComponentDT>
{

  public static dbToDomain(dbFoodComponent: FoodComponentPG): FoodComponent {
    if (!dbFoodComponent.component)
      throw new ApplicationError('FoodComponent data corrupt: component is missing check for wrong db include clause');

    const component = dbFoodComponent.compositeFood
      ? FoodSimpleMapper.dbToSimple(dbFoodComponent.component as FoodPG)
      : IngredientSimpleMapper.dbToSimple(dbFoodComponent.component as IngredientPG);

    const domainFoodComponent = new FoodComponent(
      dbFoodComponent.id,
      component,
      dbFoodComponent.amount,
      dbFoodComponent.compositeFood,
      dbFoodComponent.createdAt,
      dbFoodComponent.updatedAt
    );
    return domainFoodComponent;
  }

  dbToDomain(dbFoodComponent: FoodComponentPG): FoodComponent {
    return FoodComponentMapper.dbToDomain(dbFoodComponent);
  }

  public static dtToDomain(foodComponentDT: FoodComponentDT): FoodComponent {
    const component = foodComponentDT.compositeFood
      ? FoodSimpleMapper.dtsToSimple(foodComponentDT.component as FoodDTS)
      : IngredientSimpleMapper.dtsToSimple(foodComponentDT.component as IngredientDTS);

    const domainFoodComponent = new FoodComponent(
      foodComponentDT.id,
      component,
      foodComponentDT.amount,
      foodComponentDT.compositeFood,
      // timestamps are not accepted from the frontend
      // toOptionalDate(foodComponentDT.createdAt),
      // toOptionalDate(foodComponentDT.updatedAt)
    );
    return domainFoodComponent;
  }
  
  dtToDomain(foodComponentDT: FoodComponentDT): FoodComponent {
    return FoodComponentMapper.dtToDomain(foodComponentDT);
  }

  public static domainToDT(domainFoodComponent: FoodComponent): FoodComponentDT {
    const component = domainFoodComponent.compositeFood
      ? FoodSimpleMapper.simpleToDTS(domainFoodComponent.component)
      : IngredientSimpleMapper.simpleToDTS(domainFoodComponent.component);

    const foodComponentDT: FoodComponentDT = {
      id: domainFoodComponent.id,
      component,
      amount: domainFoodComponent.amount,
      compositeFood: domainFoodComponent.compositeFood,
      createdAt: toOptionalISOString(domainFoodComponent.createdAt),
      updatedAt: toOptionalISOString(domainFoodComponent.updatedAt)
    };
    return foodComponentDT;
  }

  domainToDT(domainFoodComponent: FoodComponent): FoodComponentDT {
    return FoodComponentMapper.domainToDT(domainFoodComponent);
  }

}