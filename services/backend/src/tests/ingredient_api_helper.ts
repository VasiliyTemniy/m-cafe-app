import type { IngredientDTN, LocStringDTN } from '@m-market-app/models';
import { ingredientService } from '../controllers';

export const initialIngredientLocStrings: LocStringDTN[] = [
  {
    mainStr: 'Котлетко',
    secStr: 'FriedMeatball',
    altStr: 'Kotletschwarzubermenschessen'
  },
  {
    mainStr: 'шт',
    secStr: 'unit? I dunno what it`s in english',
    altStr: 'Imagine that it`s not engrish'
  },
  {
    mainStr: 'Соус белый',
    secStr: 'White sauce'
  },
  {
    mainStr: 'мл',
    secStr: 'ml'
  },
  {
    mainStr: 'Хлеб',
    secStr: 'Bread'
  },
  {
    mainStr: 'гр',
    secStr: 'gr',
  },
  {
    mainStr: 'Специи'
  },
  {
    mainStr: 'гр'
  }
];

export const initialIngredients: IngredientDTN[] = [
  {
    nameLoc: initialIngredientLocStrings[0],
    stockMeasureLoc: initialIngredientLocStrings[1],
    proteins: 50,
    fats: 40,
    carbohydrates: 30,
    calories: 100
  },
  {
    nameLoc: initialIngredientLocStrings[2],
    stockMeasureLoc: initialIngredientLocStrings[3],
    proteins: 5,
    fats: 20,
    carbohydrates: 30,
    calories: 80
  },
  {
    nameLoc: initialIngredientLocStrings[4],
    stockMeasureLoc: initialIngredientLocStrings[5],
    carbohydrates: 10,
    calories: 30
  },
  {
    nameLoc: initialIngredientLocStrings[6],
    stockMeasureLoc: initialIngredientLocStrings[7],
  }
];


export const initIngredients = async (ingredientsCount?: number) => {

  let i = 0;

  const ingredients = [];

  for (const _newIngredient of initialIngredients) {
    const ingredient = await ingredientService.create(initialIngredients[i]);
    i++;
    ingredients.push(ingredient);

    if (ingredientsCount && i >= ingredientsCount) return ingredients;
  }

  return ingredients;
};