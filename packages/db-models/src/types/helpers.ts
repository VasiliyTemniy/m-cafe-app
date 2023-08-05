export type PropertiesTimestamps = 'createdAt' | 'updatedAt' | 'deletedAt';
export type PropertiesCreationOptional = 'id' | PropertiesTimestamps;

export const timestampsKeys = ['createdAt', 'updatedAt', 'deletedAt'];
export const creationOptionalKeys = ['id', ...timestampsKeys];