import type { FoodS } from './Food.js';

export class OrderFood {
  constructor (
    readonly quantity: number,
    readonly archivePrice: number,
    readonly archiveFoodId: number,
    readonly archiveFoodName: string,
    readonly orderId?: number,
    readonly food?: FoodS
  ) {}
}