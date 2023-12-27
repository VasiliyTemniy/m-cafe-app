export enum CommentParentType {
  Review = 'review',
  Order = 'order',
  // Comment = 'comment'
}

export const CommentParentTypeNumericMapping = {
  [CommentParentType.Review]: 0,
  [CommentParentType.Order]: 1
  // [CommentParentType.Comment]: 1
};

export const NumericToCommentParentTypeMapping: { [key: number]: CommentParentType } = {};
Object.values(CommentParentType).forEach((value) => {
  NumericToCommentParentTypeMapping[CommentParentTypeNumericMapping[value]] = value;
});

export const isCommentParentType = (type: unknown): type is CommentParentType => {
  if (!(typeof type === 'string')) {
    return false;
  }
  return Object.values(CommentParentType).includes(type as CommentParentType);
};