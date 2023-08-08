import { IngredientData, LocStringData } from "@m-cafe-app/db-models";
import { LocString, Ingredient } from "../models";

export const initialIngredientLocStrings: Omit<LocStringData, 'id'>[] = [
  {
    ruString: 'Котлетко',
    enString: 'FriedMeatball',
    altString: 'Kotletschwarzubermenschessen'
  },
  {
    ruString: 'шт',
    enString: 'unit? I dunno what it`s in english',
    altString: 'Imagine that it`s not engrish'
  },
  {
    ruString: 'Соус белый',
    enString: 'White sauce'
  },
  {
    ruString: 'мл',
    enString: 'ml'
  },
  {
    ruString: 'Хлеб',
    enString: 'Bread'
  },
  {
    ruString: 'гр',
    enString: 'gr',
  },
  {
    ruString: 'Специи'
  },
  {
    ruString: 'гр'
  }
];

export const initialIngredients: Omit<IngredientData, 'id' | 'nameLocId' | 'stockMeasureLocId'>[] = [
  {
    // id: 1,
    // nameLocId: 1,
    // stockMeasureLocId: 2,
    proteins: 50,
    fats: 40,
    carbohydrates: 30,
    calories: 100
  },
  {
    // id: 2,
    // nameLocId: 3,
    // stockMeasureLocId: 4,
    proteins: 5,
    fats: 20,
    carbohydrates: 30,
    calories: 80
  },
  {
    // id: 3,
    // nameLocId: 5,
    // stockMeasureLocId: 6,
    carbohydrates: 10,
    calories: 30
  },
  {
    // id: 4,
    // nameLocId: 7,
    // stockMeasureLocId: 8
  }
];


export const initIngredients = async (ingredientsCount?: number) => {

  const locStrings = await LocString.bulkCreate(initialIngredientLocStrings);

  let i = 0;

  let j = 0;

  const ingredients = [];

  for (const _newIngredient of initialIngredients) {
    const ingredient = await Ingredient.create({
      nameLocId: locStrings[i].id,
      stockMeasureLocId: locStrings[i+1].id
    });
    i += 2;
    j++;
    ingredients.push(ingredient);

    if (ingredientsCount && j >= ingredientsCount) return ingredients;
  }

  return ingredients;
};