import type { FoodS } from './Food.js';
import type { IngredientS } from './Ingredient.js';

export class FoodComponent {
  constructor (
    readonly id: number,
    readonly component: FoodS | IngredientS,
    readonly quantity: number,
    readonly compositeFood: boolean,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}

// TODO: do the same 'simple' stuff as with Stock: add foodId to FoodComponent, remove foodId from FoodComponentS