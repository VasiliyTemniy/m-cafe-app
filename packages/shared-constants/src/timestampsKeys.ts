export const timestampsKeys = [
  'createdAt',
  'updatedAt',
  'deletedAt'
] as const;

export type PropertiesTimestamps = typeof timestampsKeys[number];

export const creationOptionalKeys = [
  ...timestampsKeys,
  'id'
] as const;

export type PropertiesCreationOptional = typeof creationOptionalKeys[number];