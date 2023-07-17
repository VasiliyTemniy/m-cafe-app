import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import SimpleFood from './food.js';
import Ingredient from './ingredient.js';

import { sequelize } from '../utils/db.js';

class FoodIngredient extends Model<InferAttributes<FoodIngredient>, InferCreationAttributes<FoodIngredient>> {
  declare id: CreationOptional<number>;
  declare foodId: ForeignKey<SimpleFood['id']>;
  declare ingredientId: ForeignKey<Ingredient['id']>;  
  declare amount: number;
}

FoodIngredient.init({
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
  ingredientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'ingredients', key: 'id' }
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'food_ingredient'
});

export default FoodIngredient;