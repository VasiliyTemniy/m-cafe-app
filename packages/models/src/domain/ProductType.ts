import type { LocS } from './Loc.js';

export class ProductType {
  constructor (
    readonly id: number,
    readonly nameLocs: LocS[],
    readonly descriptionLocs: LocS[],
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}