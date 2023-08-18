import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { PropertiesCreationOptional } from '../types/helpers.js';

export class UiSetting extends Model<InferAttributes<UiSetting>, InferCreationAttributes<UiSetting>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare value: string;
}


export type UiSettingData = Omit<InferAttributes<UiSetting>, PropertiesCreationOptional>
  & { id: number; };