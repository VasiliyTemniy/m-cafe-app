import type { FoodS } from './Food.js';
import type { IngredientS } from './Ingredient.js';

export class FoodComponent {
  constructor (
    readonly id: number,
    readonly component: FoodS | IngredientS,
    readonly amount: number,
    readonly compositeFood: boolean,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}