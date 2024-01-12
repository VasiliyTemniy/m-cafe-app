import type { LocString } from './LocString.js';


/**
 * Full Ingredient data
 */
export class Ingredient {
  constructor (
    readonly id: number,
    readonly nameLoc: LocString,
    readonly stockMeasureLoc: LocString,
    readonly proteins?: number,
    readonly fats?: number,
    readonly carbohydrates?: number,
    readonly calories?: number,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}


/**
 * Simple Ingredient data to be included in foodComponent
 */
export class IngredientS {
  constructor (
    readonly id: number,
    readonly nameLoc: LocString,
    // readonly proteins?: number, // Possibly remove these
    // readonly fats?: number,
    // readonly carbohydrates?: number,
    // readonly calories?: number,
  ) {}
}