import type { PictureParentType } from '@m-market-app/shared-constants';
import type { Loc } from './Loc.js';

export class Picture {
  constructor (
    readonly id: number,
    readonly src: string,
    readonly parentId: number,
    readonly parentType: PictureParentType,
    readonly orderNumber: number,
    readonly altTextLocs: Loc[],
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}

export class PictureS {
  constructor (
    readonly src: string,
    readonly orderNumber: number,
    readonly altTextLocs: Loc[]
  ) {}
}