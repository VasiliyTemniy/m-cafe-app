import type { LocS } from './Loc.js';
import type { PictureS } from './Picture.js';


/**
 * Full Ingredient data
 */
export class Ingredient {
  constructor (
    readonly id: number,
    readonly nameLocs: LocS[],
    readonly descriptionLocs: LocS[],
    readonly stockMeasureLocs: LocS[],
    readonly unitMass?: number,
    readonly unitVolume?: number,
    readonly proteins?: number,
    readonly fats?: number,
    readonly carbohydrates?: number,
    readonly calories?: number,
    readonly pictures?: PictureS[],
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}


/**
 * Simple Ingredient data to be included in productComponent
 */
export class IngredientS {
  constructor (
    readonly id: number,
    readonly nameLoc: LocS[],
    // readonly unitMass?: number, // Possibly remove these
    // readonly unitVolume?: number,
    // readonly proteins?: number,
    // readonly fats?: number,
    // readonly carbohydrates?: number,
    // readonly calories?: number,
  ) {}
}