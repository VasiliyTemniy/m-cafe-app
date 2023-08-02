import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
import { FoodComponent } from '@m-cafe-app/db-models';

FoodComponent.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  foodId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'foods', key: 'id' },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
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