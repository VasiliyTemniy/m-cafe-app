import type { FoodS } from './Food.js';

export class OrderFood {
  constructor (
    readonly id: number,
    readonly orderId: number,
    readonly amount: number,
    readonly archivePrice: number,
    readonly archiveFoodName: string,
    readonly food?: FoodS
  ) {}
}

/**
 * Simple version of OrderFood must be included in Order
 */
export class OrderFoodS {
  constructor (
    readonly id: number,
    readonly amount: number,
    readonly archivePrice: number,
    readonly archiveFoodName: string,
    readonly food?: FoodS
  ) {}
}