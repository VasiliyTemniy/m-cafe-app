import type { LocS } from './Loc.js';
import type { PictureS } from './Picture.js';
import type { ProductCategoryS } from './ProductCategory.js';
import type { ProductComponent } from './ProductComponent.js';
import type { ProductType } from './ProductType.js';
import type { Review } from './Review.js';

export class Product {
  constructor (
    readonly id: number,
    readonly nameLocs: LocS[],
    readonly descriptionLocs: LocS[],
    readonly price: number,
    readonly totalMass?: number,
    readonly totalVolume?: number,
    readonly boxSizingX?: number,
    readonly boxSizingY?: number,
    readonly boxSizingZ?: number,
    readonly productType?: ProductType,
    readonly categories?: ProductCategoryS[],
    readonly reviews?: Review[],
    readonly pictures?: PictureS[],
    readonly components?: ProductComponent[],
    readonly rating?: number,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}

export class ProductS {
  constructor (
    readonly id: number,
    readonly nameLocs: LocS[],
    readonly descriptionLocs: LocS[],
    readonly price: number,
    readonly mainPicture?: PictureS,
    readonly rating?: number
  ) {}
}