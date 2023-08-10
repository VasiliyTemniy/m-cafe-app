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

FoodComponent.addHook("afterFind", findResult => {
  if (!findResult) return;

  const mapComponentKey = (instance: FoodComponent) => {
    if (instance.compositeFood && instance.food !== undefined) {
      instance.component = instance.food;
    } else if (!instance.compositeFood && instance.ingredient !== undefined) {
      instance.component = instance.ingredient;
    }
    // Taken from sequelize docs
    // To prevent mistakes:
    delete instance.food;
    // delete instance.dataValues.food;
    delete instance.ingredient;
    // delete instance.dataValues.ingredient;
  };

  if (!Array.isArray(findResult)) {
    mapComponentKey(findResult as FoodComponent);
  }

  for (const instance of findResult as FoodComponent[]) {
    mapComponentKey(instance);
  }
});

export default FoodComponent;