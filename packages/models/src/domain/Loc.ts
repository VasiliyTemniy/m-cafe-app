import type { LocParentType, LocType } from '@m-cafe-app/shared-constants';

/**
 * Contains languageId, parentId, parentType, locType, translation text and timestamps
 * For internal service usage
 */
export class Loc {
  constructor(
    readonly languageId: number,
    readonly locType: LocType,
    readonly parentId: number,
    readonly parentType: LocParentType,
    readonly text: string,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}

/**
 * Contains only translation and languageCode, no ids or references
 */
export class LocS {
  constructor(
    readonly text: string,
    readonly languageCode: string
  ) {}
}