import type { Picture } from './Picture';

export class FoodPicture {
  constructor (
    readonly picture: Picture,
    readonly orderNumber: number
  ) {}
}