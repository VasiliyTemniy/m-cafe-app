import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import LocString from './LocString.js';

import { sequelize } from '../utils/db.js';

class Image extends Model<InferAttributes<Image>, InferCreationAttributes<Image>> {
  declare id: CreationOptional<number>;
  declare imageSrc: string;
  declare altTextLocId: ForeignKey<LocString['id']>;
}

Image.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  imageSrc: {
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
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'images'
});

export default Image;