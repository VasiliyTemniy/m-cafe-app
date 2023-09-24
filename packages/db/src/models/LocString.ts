import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { PropertiesCreationOptional } from '../types/helpers.js';
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db.js';


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

  
LocString.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mainStr: {
    type: DataTypes.STRING,
    allowNull: false
  },
  secStr: {
    type: DataTypes.STRING,
    allowNull: true
  },
  altStr: {
    type: DataTypes.STRING,
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
  modelName: 'loc_string'
});
  
export default LocString;