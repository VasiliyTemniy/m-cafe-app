import type { ReviewParentType } from '@m-cafe-app/shared-constants';
import type { User } from './User.js';
import type { CommentS } from './Comment.js';
import type { PictureS } from './Picture.js';


export class Review {
  constructor (
    readonly id: number,
    readonly parentId: number,
    readonly parentType: ReviewParentType,
    readonly text: string,
    readonly rating: number,
    readonly author?: User,
    readonly comments?: CommentS[],
    readonly pictures?: PictureS[],
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}