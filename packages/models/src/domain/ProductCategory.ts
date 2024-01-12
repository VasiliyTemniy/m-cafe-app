import type { LocS } from './Loc.js';
import type { ProductType } from './ProductType.js';
import type { ProductS } from './Product.js';

export class ProductCategory {
  constructor (
    readonly id: number,
    readonly nameLocs: LocS[],
    readonly descriptionLocs: LocS[],
    readonly nestLevel: number,
    readonly productType?: ProductType,
    readonly products?: ProductS[],
    readonly childCategories?: ProductCategory[],
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}

export class ProductCategoryS {
  constructor (
    readonly id: number,
    readonly nameLocs: LocS[],
    readonly nestLevel: number
  ) {}
}