import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import { FoodType } from './FoodType.js';
import { LocString } from './LocString.js';

export class Food extends Model<InferAttributes<Food>, InferCreationAttributes<Food>> {
  declare id: CreationOptional<number>;
  declare nameLocId: ForeignKey<LocString['id']>;
  declare foodTypeId: ForeignKey<FoodType['id']>;
  declare descriptionLocId: ForeignKey<LocString['id']>;
  declare price: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}