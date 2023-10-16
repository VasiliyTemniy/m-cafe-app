import type { LocString } from './LocString';

export class FoodType {
  constructor (
    readonly id: number,
    readonly nameLoc: LocString,
    readonly descriptionLoc: LocString,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}