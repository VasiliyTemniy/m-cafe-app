import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { PropertiesCreationOptional } from '../types/helpers.js';
import { LocString } from './LocString.js';

export class FixedLoc extends Model<InferAttributes<FixedLoc>, InferCreationAttributes<FixedLoc>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare locStringId: ForeignKey<LocString['id']>;
  declare locString?: NonAttribute<LocString>;
}


export type FixedLocData = Omit<InferAttributes<FixedLoc>, PropertiesCreationOptional>
  & { id: number; };