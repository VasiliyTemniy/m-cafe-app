import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import LocString from './LocString.js';

import { sequelize } from '../utils/db.js';

class Picture extends Model<InferAttributes<Picture>, InferCreationAttributes<Picture>> {
  declare id: CreationOptional<number>;
  declare src: string;
  declare altTextLocId: ForeignKey<LocString['id']>;
}

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
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'pictures'
});

export default Picture;