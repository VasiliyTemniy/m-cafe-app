export enum CommentParentType {
  Review = 0,
  Order = 1,
}

export const isCommentParentType = (type: unknown): type is CommentParentType =>
  (typeof type === 'number' || typeof type === 'string') &&
  (type in CommentParentType);