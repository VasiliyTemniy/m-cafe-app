import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import Facility from './facility.js';
import Ingredient from './ingredient.js';

import { sequelize } from '../utils/db.js';

class Stock extends Model<InferAttributes<Stock>, InferCreationAttributes<Stock>> {
  declare id: CreationOptional<number>;
  declare ingredientId: ForeignKey<Ingredient['id']>;
  declare facilityId: ForeignKey<Facility['id']>;
  declare amount: number;
}

Stock.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ingredientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'ingredients', key: 'id' }
  },
  facilityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'facilities', key: 'id' }
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'stock'
});

export default Stock;