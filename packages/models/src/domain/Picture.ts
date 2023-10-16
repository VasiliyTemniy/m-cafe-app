import type { LocString } from './LocString.js';

export class Picture {
  constructor (
    readonly id: number,
    readonly url: string,
    readonly altTextLoc: LocString,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}