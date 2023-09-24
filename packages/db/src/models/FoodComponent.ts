import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import type { PropertiesCreationOptional } from '../types/helpers.js';
import { Model, DataTypes } from 'sequelize';
import Food from './Food.js';
import Ingredient from './Ingredient.js';
import { sequelize } from '../db.js';


export class FoodComponent extends Model<InferAttributes<FoodComponent>, InferCreationAttributes<FoodComponent>> {
  declare id: CreationOptional<number>;
  declare foodId: ForeignKey<Food['id']>;
  declare componentId: number;
  declare amount: number;
  declare compositeFood: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare component?: NonAttribute<Food> | NonAttribute<Ingredient>;
  declare food?: NonAttribute<Food>;
  declare ingredient?: NonAttribute<Ingredient>;
}


export type FoodComponentData = Omit<InferAttributes<FoodComponent>, PropertiesCreationOptional>
  & { id: number; };

  
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
  
FoodComponent.addHook('afterFind', findResult => {
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
  
  if (!Array.isArray(findResult)) {
    mapComponentKey(findResult as FoodComponent);
    return;
  }
  
  for (const instance of findResult as FoodComponent[]) {
    mapComponentKey(instance);
  }
});
  
export default FoodComponent;