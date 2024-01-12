/**
 * Represents connection between ingredient and its quantity in
 * particular facility
 */
export class Stock {
  constructor (
    readonly id: number,
    readonly ingredientId: number,
    readonly facilityId: number,
    readonly quantity: number,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}


/**
 * Has info about ingredient and quantity, not about facility \
 * Should be included in facility info
 */
export class StockS {
  constructor (
    readonly id: number,
    readonly ingredientId: number,
    readonly quantity: number
  ) {}
}