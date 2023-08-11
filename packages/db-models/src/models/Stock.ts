import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import { PropertiesCreationOptional } from '../types/helpers.js';
import { Facility } from './Facility.js';
import { Ingredient } from './Ingredient.js';

export class Stock extends Model<InferAttributes<Stock>, InferCreationAttributes<Stock>> {
  declare id: CreationOptional<number>;
  declare ingredientId: ForeignKey<Ingredient['id']>;
  declare facilityId: ForeignKey<Facility['id']>;
  declare amount: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export type StockData = Omit<InferAttributes<Stock>, PropertiesCreationOptional>
& { id: number; };