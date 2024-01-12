import type { FacilityType } from '@m-cafe-app/shared-constants';
import type { Address } from './Address.js';
import type { LocS } from './Loc.js';
import type { StockS } from './Stock.js';
import type { User } from './User.js';
import type { PictureS } from './Picture.js';
import type { Order } from './Order.js';
import type { OrderTracking } from './OrderTracking.js';
import type { Review } from './Review.js';


export class Facility {
  constructor (
    readonly id: number,
    readonly nameLocs: LocS[],
    readonly descriptionLocs: LocS[],
    readonly facilityType: FacilityType,
    readonly address: Address,
    readonly managers?: User[],
    readonly stocks?: StockS[],
    readonly pictures?: PictureS[],
    readonly orders?: Order[],
    readonly transitOrders?: OrderTracking[],
    readonly reviews?: Review[],
    readonly rating?: number,
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
    readonly nameLocs: LocS[],
    readonly descriptionLocs: LocS[],
  ) {}
}