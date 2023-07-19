import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import Food from './food.js';

import { sequelize } from '../utils/db.js';

class FoodComponent extends Model<InferAttributes<FoodComponent>, InferCreationAttributes<FoodComponent>> {
  declare id: CreationOptional<number>;
  declare foodId: ForeignKey<Food['id']>;
  declare componentId: number;  
  declare amount: number;
  declare compositeFood: boolean;
}

FoodComponent.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  foodId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'foods', key: 'id' }
  },
  componentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  compositeFood: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'food_component',
  defaultScope: {
    where: {
      compositeFood: false
    }
  },
  scopes: {
    compositeFood: {
      where: {
        compositeFood: true
      }
    },
    simpleFood: {
      where: {
        compositeFood: false
      }
    },
    all: {}
  }
});

export default FoodComponent;