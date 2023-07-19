import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import LocString from './locString.js';

import { sequelize } from '../utils/db.js';

class DynamicText extends Model<InferAttributes<DynamicText>, InferCreationAttributes<DynamicText>> {
  declare id: CreationOptional<number>;
  declare locStringId: CreationOptional<ForeignKey<LocString['id']>>;
  declare page: string;
  declare placement: number;
  declare inlineCSS: CreationOptional<string>;
  declare imageSrc: CreationOptional<string>;
}

DynamicText.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  locStringId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'loc_strings', key: 'id' }
  },
  page: {
    type: DataTypes.STRING,
    allowNull: false
  },
  placement: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  inlineCSS: {
    type: DataTypes.STRING,
    allowNull: true
  },
  imageSrc: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'dynamic_text'
});

export default DynamicText;