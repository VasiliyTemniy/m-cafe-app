import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { PropertiesCreationOptional } from '../types/helpers.js';
import { FoodComponent } from './FoodComponent.js';
import { FoodPicture } from './FoodPicture.js';
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
  declare foodType?: NonAttribute<FoodType>;
  declare nameLoc?: NonAttribute<LocString>;
  declare descriptionLoc?: NonAttribute<LocString>;
  declare foodComponents?: NonAttribute<FoodComponent[]>;
  declare mainPicture?: NonAttribute<FoodPicture>;
  declare gallery?: NonAttribute<FoodPicture[]>;
}


export type FoodData = Omit<InferAttributes<Food>, PropertiesCreationOptional>
  & { id: number; };