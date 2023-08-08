import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { PropertiesCreationOptional } from '../types/helpers.js';
import { LocString } from './LocString.js';

export class Ingredient extends Model<InferAttributes<Ingredient>, InferCreationAttributes<Ingredient>> {
  declare id: CreationOptional<number>;
  declare nameLocId: ForeignKey<LocString['id']>;
  declare stockMeasureLocId: ForeignKey<LocString['id']>;
  declare proteins?: number;
  declare fats?: number;
  declare carbohydrates?: number;
  declare calories?: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare nameLoc?: NonAttribute<LocString>;
  declare stockMeasureLoc?: NonAttribute<LocString>;
}


export type IngredientData = Omit<InferAttributes<Ingredient>, PropertiesCreationOptional>
  & { id: number; };