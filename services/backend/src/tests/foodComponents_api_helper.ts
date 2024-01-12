import type { FoodDT, FoodDTN, IngredientDT, LocStringDTN } from '@m-cafe-app/models';
import { foodComponentService, foodService, foodTypeService } from '../controllers';


const newCompositeFoodLocStrings: LocStringDTN[] = [
  {
    mainStr: 'Сет "Домик в деревне"'
  },
  {
    mainStr: 'Прекрасный сет на ужин для компании от 1 до 100 человек'
  }
];

const newCompositeFood: Omit<FoodDTN, 'foodTypeId'> = {
  nameLoc: newCompositeFoodLocStrings[0],
  descriptionLoc: newCompositeFoodLocStrings[1],
  price: 4800
};


const createFoodComponents = async (
  compositeFood: boolean,
  componentIds: number[],
  amountMin: number,
  amountMax: number,
  componentsMin: number,
  componentsMax: number,
  foodId: number
) => {
  let unusedComponentIds = [...componentIds];

  for (let i = 0; i < Math.round(Math.random() * (componentsMax - componentsMin)) + componentsMin; i++) {

    const componentId = unusedComponentIds[Math.round(Math.random() * (unusedComponentIds.length - 1))];

    await foodComponentService.create({
      foodId,
      quantity: Math.round(Math.random() * (amountMax - amountMin)) + amountMin,
      compositeFood,
      componentId
    });

    unusedComponentIds = [...unusedComponentIds].filter(id => id !== componentId);
  }
};

/**
 * Inits foodTypes, foods, their locStrings, inits ingredients.
 * Then mixes them at random to make
 * one composite food
 * and those in food_api_helper.ts - simple foods.
 * Returns all initial foods
 * @param amountMin 
 * @param amountMax 
 * @param componentsMin 
 * @param componentsMax 
 */
export const initFoodComponents = async (
  foods: FoodDT[],
  ingredients: IngredientDT[],
  amountMin: number = 1,
  amountMax: number = 10,
  componentsMin: number = 1,
  componentsMax: number = 4
) => {

  const foodIds = foods.map(food => food.id);
  const ingredientIds = ingredients.map(ingredient => ingredient.id);

  // init just one composite food for tests to have less problems with cross-dependencies of foods
  const withFoodOnly = false;
  const foodTypes = await foodTypeService.getAll(withFoodOnly);

  const compositeFood = await foodService.create({
    ...newCompositeFood,
    foodTypeId: foodTypes[Math.round(Math.random() * (foodTypes.length - 1))].id,
  });

  await createFoodComponents(true, foodIds, amountMin, amountMax, componentsMin, componentsMax, compositeFood.id);

  // At first I wanted to make random const compositeFood = Boolean(Math.round(Math.random()))
  // To make random food types in following loop, but it can cause some unforeseen problems, so its better to not use it like that
  for (const food of foods) {
    await createFoodComponents(false, ingredientIds, amountMin, amountMax, componentsMin, componentsMax, food.id);
  }

  return [compositeFood, ...foods];
};