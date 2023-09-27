import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import type { PropertiesCreationOptional } from '../types/helpers.js';
import { Model, DataTypes } from 'sequelize';
import LocString from './LocString.js';
import { sequelize } from '../db.js';


export class FixedLoc extends Model<InferAttributes<FixedLoc>, InferCreationAttributes<FixedLoc>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare locStringId: ForeignKey<LocString['id']>;
  declare locString?: NonAttribute<LocString>;
}


export type FixedLocData = Omit<InferAttributes<FixedLoc>, PropertiesCreationOptional>
  & { id: number; };

  
FixedLoc.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  locStringId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'loc_strings', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'fixed_loc'
});
  
export default FixedLoc;