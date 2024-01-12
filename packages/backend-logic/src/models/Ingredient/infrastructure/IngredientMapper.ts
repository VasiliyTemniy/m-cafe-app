import type { EntityDBMapper, EntityDTMapper } from '../../../utils';
import type { IngredientDT } from '@m-market-app/models';
import { Ingredient } from '@m-market-app/models';
import { Ingredient as IngredientPG } from '@m-market-app/db';
import { ApplicationError, toOptionalISOString } from '@m-market-app/utils';
import { LocStringMapper } from '../../LocString';


export class IngredientMapper implements EntityDBMapper<Ingredient, IngredientPG>, EntityDTMapper<Ingredient, IngredientDT> {

  public static dbToDomain(dbIngredient: IngredientPG): Ingredient {
    if (!dbIngredient.nameLoc || !dbIngredient.stockMeasureLoc)
      throw new ApplicationError('Ingredient data corrupt: nameLoc or stockMeasureLoc is missing check for wrong db include clause');

    const domainIngredient = new Ingredient(
      dbIngredient.id,
      LocStringMapper.dbToDomain(dbIngredient.nameLoc),
      LocStringMapper.dbToDomain(dbIngredient.stockMeasureLoc),
      dbIngredient.proteins,
      dbIngredient.fats,
      dbIngredient.carbohydrates,
      dbIngredient.calories,
      dbIngredient.createdAt,
      dbIngredient.updatedAt
    );
    return domainIngredient;
  }

  dbToDomain(dbIngredient: IngredientPG): Ingredient {
    return IngredientMapper.dbToDomain(dbIngredient);
  }

  public static dtToDomain(ingredientDT: IngredientDT): Ingredient {
    const domainIngredient = new Ingredient(
      ingredientDT.id,
      LocStringMapper.dtToDomain(ingredientDT.nameLoc),
      LocStringMapper.dtToDomain(ingredientDT.stockMeasureLoc),
      ingredientDT.proteins,
      ingredientDT.fats,
      ingredientDT.carbohydrates,
      ingredientDT.calories
    );
    return domainIngredient;
  }
  
  dtToDomain(ingredientDT: IngredientDT): Ingredient {
    return IngredientMapper.dtToDomain(ingredientDT);
  }

  public static domainToDT(domainIngredient: Ingredient): IngredientDT {
    const ingredientDT: IngredientDT = {
      id: domainIngredient.id,
      nameLoc: LocStringMapper.domainToDT(domainIngredient.nameLoc),
      stockMeasureLoc: LocStringMapper.domainToDT(domainIngredient.stockMeasureLoc),
      proteins: domainIngredient.proteins,
      fats: domainIngredient.fats,
      carbohydrates: domainIngredient.carbohydrates,
      calories: domainIngredient.calories,
      createdAt: toOptionalISOString(domainIngredient.createdAt),
      updatedAt: toOptionalISOString(domainIngredient.updatedAt)
    };
    return ingredientDT;
  }

  domainToDT(domainIngredient: Ingredient): IngredientDT {
    return IngredientMapper.domainToDT(domainIngredient);
  }

}