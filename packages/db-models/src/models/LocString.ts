import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { PropertiesCreationOptional } from '../types/helpers';

export class LocString extends Model<InferAttributes<LocString>, InferCreationAttributes<LocString>> {
  declare id: CreationOptional<number>;
  declare mainStr: string;
  declare secStr?: string;
  declare altStr?: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export type LocStringData = Omit<InferAttributes<LocString>, PropertiesCreationOptional>
  & { id: number; };