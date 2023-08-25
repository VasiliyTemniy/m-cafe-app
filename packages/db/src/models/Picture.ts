import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute, DataTypes } from 'sequelize';
import { PropertiesCreationOptional } from '../types/helpers.js';
import LocString from './LocString.js';
import { sequelize } from '../db.js';


export class Picture extends Model<InferAttributes<Picture>, InferCreationAttributes<Picture>> {
  declare id: CreationOptional<number>;
  declare src: string;
  declare altTextLocId: ForeignKey<LocString['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare altTextLoc?: NonAttribute<LocString>;
}


export type PictureData = Omit<InferAttributes<Picture>, PropertiesCreationOptional>
  & { id: number; };

  
Picture.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  src: {
    type: DataTypes.STRING,
    allowNull: false
  },
  altTextLocId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'loc_strings', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
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
  modelName: 'picture'
});
  
export default Picture;