import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import FoodType from './FoodType.js';
import LocString from './LocString.js';

import { sequelize } from '../utils/db.js';

class Food extends Model<InferAttributes<Food>, InferCreationAttributes<Food>> {
  declare id: CreationOptional<number>;
  declare nameLocId: ForeignKey<LocString['id']>;
  declare foodTypeId: ForeignKey<FoodType['id']>;
  declare descriptionLocId: ForeignKey<LocString['id']>;
  declare price: number;
}

Food.init({
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
  foodTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'food_types', key: 'id' }
  },
  descriptionLocId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'loc_strings', key: 'id' }
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'foods'
});

export default Food;