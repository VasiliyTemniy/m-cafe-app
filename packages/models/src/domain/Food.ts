import type { FoodType } from './FoodType.js';
import type { LocString } from './LocString.js';
import type { Picture } from './Picture.js';
import type { FoodComponent } from './FoodComponent.js';

export class Food {
  constructor (
    readonly id: number,
    readonly nameLoc: LocString,
    readonly descriptionLoc: LocString,
    readonly foodType: FoodType,
    readonly foodComponents?: FoodComponent[],
    readonly mainPicture?: Picture,
    readonly gallery?: Picture[],
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