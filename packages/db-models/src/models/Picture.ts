import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { PropertiesCreationOptional } from '../types/helpers.js';
import { LocString } from './LocString.js';

export class Picture extends Model<InferAttributes<Picture>, InferCreationAttributes<Picture>> {
  declare id: CreationOptional<number>;
  declare src: string;
  declare altTextLocId: ForeignKey<LocString['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare altTextLoc?: NonAttribute<LocString>;
}


export type PictureData = Omit<InferAttributes<Picture>, PropertiesCreationOptional>
  & { id: number; };