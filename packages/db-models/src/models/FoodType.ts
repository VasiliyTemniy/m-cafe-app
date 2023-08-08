import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { PropertiesCreationOptional } from '../types/helpers.js';
import { Food } from './Food.js';
import { LocString } from './LocString.js';

export class FoodType extends Model<InferAttributes<FoodType>, InferCreationAttributes<FoodType>> {
  declare id: CreationOptional<number>;
  declare nameLocId: ForeignKey<LocString['id']>;
  declare descriptionLocId: ForeignKey<LocString['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare nameLoc?: NonAttribute<LocString>;
  declare descriptionLoc?: NonAttribute<LocString>;
  declare foodTypeFoods?: NonAttribute<Food>[];
}


export type FoodTypeData = Omit<InferAttributes<FoodType>, PropertiesCreationOptional>
  & { id: number; };