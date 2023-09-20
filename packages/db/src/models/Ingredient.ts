import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import type { PropertiesCreationOptional } from "../types/helpers.js";
import { Model, DataTypes } from 'sequelize';
import LocString from './LocString.js';
import { sequelize } from '../db.js';


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

  
Ingredient.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nameLocId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'loc_strings', key: 'id' }
  },
  stockMeasureLocId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'loc_strings', key: 'id' }
  },
  proteins: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fats: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  carbohydrates: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'ingredient'
});
  
export default Ingredient;