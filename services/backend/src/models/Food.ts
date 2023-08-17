import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
import { Food } from '@m-cafe-app/db-models';
import FoodComponent from './FoodComponent.js';

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
  modelName: 'foods'
});

Food.addHook("afterFind", findResult => {
  if (!findResult) return;

  const mapComponentKey = (instance: FoodComponent) => {
    if (instance.compositeFood && instance.food !== undefined) {
      instance.component = instance.food;
    } else if (!instance.compositeFood && instance.ingredient !== undefined) {
      instance.component = instance.ingredient;
    }
    delete instance.food;
    delete instance.ingredient;
  };

  const mapFoodComponents = (instance: Food) => {
    if (instance.foodComponents && instance.foodComponents !== undefined) {
      for (const foodComponent of instance.foodComponents) {
        mapComponentKey(foodComponent);
      }
      return;
    }
  };

  if (!Array.isArray(findResult)) {
    mapFoodComponents(findResult as Food);
    return;
  }

  for (const instance of findResult as Food[]) {
    mapFoodComponents(instance);
  }
});

export default Food;