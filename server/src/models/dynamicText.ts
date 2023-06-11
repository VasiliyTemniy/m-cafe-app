import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'

import { sequelize } from '../utils/db'

class DynamicText extends Model<InferAttributes<DynamicText>, InferCreationAttributes<DynamicText>> {
  declare id: CreationOptional<number>;
  declare ruText: CreationOptional<string>;
  declare enText: CreationOptional<string>;
  declare arText: CreationOptional<string>;
  declare page: string;
  declare placement: Number;
  declare inlineCSS: CreationOptional<string>;
  declare imageSrc: CreationOptional<string>;
}

DynamicText.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ruText: {
    type: DataTypes.STRING,
    allowNull: true
  },
  enText: {
    type: DataTypes.STRING,
    allowNull: true
  },
  arText: {
    type: DataTypes.STRING,
    allowNull: true
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
})

export default DynamicText