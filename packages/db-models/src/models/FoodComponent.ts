import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { PropertiesCreationOptional } from '../types/helpers.js';
import { Food } from './Food.js';
import { Ingredient } from './Ingredient.js';

export class FoodComponent extends Model<InferAttributes<FoodComponent>, InferCreationAttributes<FoodComponent>> {
  declare id: CreationOptional<number>;
  declare foodId: ForeignKey<Food['id']>;
  declare componentId: number;
  declare amount: number;
  declare compositeFood: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare component?: NonAttribute<Food> | NonAttribute<Ingredient>;
  declare food?: NonAttribute<Food>;
  declare ingredient?: NonAttribute<Ingredient>;
}


export type FoodComponentData = Omit<InferAttributes<FoodComponent>, PropertiesCreationOptional>
  & { id: number; };