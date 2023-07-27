import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import LocString from './LocString.js';
import Picture from './Picture.js';

import { sequelize } from '../utils/db.js';

class DynamicModule extends Model<InferAttributes<DynamicModule>, InferCreationAttributes<DynamicModule>> {
  declare id: CreationOptional<number>;
  declare moduleType: string;
  declare locStringId: CreationOptional<ForeignKey<LocString['id']>>;
  declare page: string;
  declare placement: number;
  declare className: CreationOptional<string>;
  declare inlineCss: CreationOptional<string>;
  declare pictureId: CreationOptional<ForeignKey<Picture['id']>>;
  declare url: CreationOptional<string>;
}

DynamicModule.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  moduleType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  locStringId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'loc_strings', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  page: {
    type: DataTypes.STRING,
    allowNull: false
  },
  placement: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  className: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  inlineCss: {
    type: DataTypes.STRING,
    allowNull: true
  },
  pictureId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'pictures', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'dynamic_module'
});

export default DynamicModule;