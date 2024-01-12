import type { CommentParentType } from '@m-market-app/shared-constants';
import type { User } from './User';


export class Comment {
  constructor (
    readonly id: number,
    readonly text: string,
    readonly parentId: number,
    readonly parentType: CommentParentType,
    readonly orderNumber: number,
    readonly archiveUserName?: string,
    readonly childComments?: Comment[],
    readonly author?: User,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}


export class CommentS {
  constructor (
    readonly text: string,
    readonly orderNumber: number,
    readonly archiveUserName?: string,
    readonly childComments?: CommentS[],
    readonly author?: User,
    readonly createdAt?: Date,
    readonly updatedAt?: Date
  ) {}
}