import type { EntitySimpleMapper } from '../../../utils';
import type { Ingredient as IngredientPG } from '@m-cafe-app/db';
import { IngredientS, type Ingredient, type IngredientDTS } from '@m-cafe-app/models';
import { LocStringMapper } from '../../LocString';

export class IngredientSimpleMapper implements EntitySimpleMapper<Ingredient, IngredientS, IngredientPG, IngredientDTS> {
  public static domainToSimple(domainIngredient: Ingredient): IngredientS {
    const ingredientS = new IngredientS(
      domainIngredient.id,
      domainIngredient.nameLoc
    );
    return ingredientS;
  }

  domainToSimple(domainIngredient: Ingredient): IngredientS {
    return IngredientSimpleMapper.domainToSimple(domainIngredient);
  }

  public static dbToSimple(dbIngredient: IngredientPG): IngredientS {
    if (!dbIngredient.nameLoc)
      throw new Error('Ingredient simple data corrupt: nameLoc is missing check for wrong db include clause');

    const ingredientS = new IngredientS(
      dbIngredient.id,
      LocStringMapper.dbToDomain(dbIngredient.nameLoc)
    );

    return ingredientS;
  }

  dbToSimple(dbIngredient: IngredientPG): IngredientS {
    return IngredientSimpleMapper.dbToSimple(dbIngredient);
  }

  public static dtsToSimple(ingredientDTS: IngredientDTS): IngredientS {
    const ingredientS = new IngredientS(
      ingredientDTS.id,
      LocStringMapper.dtToDomain(ingredientDTS.nameLoc)
    );
    return ingredientS;
  }

  dtsToSimple(ingredientDTS: IngredientDTS): IngredientS {
    return IngredientSimpleMapper.dtsToSimple(ingredientDTS);
  }

  public static simpleToDTS(ingredientS: IngredientS): IngredientDTS {
    const ingredientDTS: IngredientDTS = {
      id: ingredientS.id,
      nameLoc: LocStringMapper.domainToDT(ingredientS.nameLoc)
    };
    return ingredientDTS;
  }

  simpleToDTS(ingredientS: IngredientS): IngredientDTS {
    return IngredientSimpleMapper.simpleToDTS(ingredientS);
  }
}