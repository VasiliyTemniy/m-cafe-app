import type { StockEntityType, StockStatus } from '@m-market-app/shared-constants';
import type { ProductS } from './Product';
import type { IngredientS } from './Ingredient';

/**
 * Represents connection between entity and its quantity in
 * particular facility
 */
export class Stock {
  constructor (
    readonly id: number,
    readonly entityId: number,
    readonly entityType: StockEntityType,
    readonly facilityId: number,
    readonly quantity: number,
    readonly status: StockStatus,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}


/**
 * Has info about entity and quantity, not about facility \
 * Should be included in facility info
 */
export class StockS {
  constructor (
    readonly id: number,
    readonly entity: ProductS | IngredientS,
    readonly entityType: StockEntityType,
    readonly status: StockStatus,
    readonly quantity: number
  ) {}
}