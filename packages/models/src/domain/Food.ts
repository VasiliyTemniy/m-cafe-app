import type { FoodType } from './FoodType.js';
import type { LocString } from './LocString.js';
import type { FoodPicture } from './FoodPicture.js';
import type { FoodComponent } from './FoodComponent.js';

export class Food {
  constructor (
    readonly id: number,
    readonly nameLoc: LocString,
    readonly descriptionLoc: LocString,
    readonly foodType: FoodType,
    readonly foodComponents?: FoodComponent[],
    readonly mainPicture?: FoodPicture,
    readonly gallery?: FoodPicture[],
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}

/**
 * Simple food data includes only id and name locale
 */
export class FoodS {
  constructor (
    readonly id: number,
    readonly nameLoc: LocString
  ) {}
}