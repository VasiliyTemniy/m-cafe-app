import type { Address } from './Address.js';
import type { LocString } from './LocString.js';
import type { StockS } from './Stock.js';
import type { User } from './User.js';

export class Facility {
  constructor (
    readonly id: number,
    readonly nameLoc: LocString,
    readonly descriptionLoc: LocString,
    readonly address: Address,
    readonly managers?: User[],
    readonly stocks?: StockS[],
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}


/**
 * Simple data about Facility contains only nameLoc and descriptionLoc
 */
export class FacilityS {
  constructor (
    readonly id: number,
    readonly nameLoc: LocString,
    readonly descriptionLoc: LocString,
  ) {}
}