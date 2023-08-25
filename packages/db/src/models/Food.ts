import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute, DataTypes } from 'sequelize';
import { PropertiesCreationOptional } from '../types/helpers.js';
import FoodComponent from './FoodComponent.js';
import FoodPicture from './FoodPicture.js';
import FoodType from './FoodType.js';
import LocString from './LocString.js';
import { sequelize } from '../db.js';


export class Food extends Model<InferAttributes<Food>, InferCreationAttributes<Food>> {
  declare id: CreationOptional<number>;
  declare nameLocId: ForeignKey<LocString['id']>;
  declare foodTypeId: ForeignKey<FoodType['id']>;
  declare descriptionLocId: ForeignKey<LocString['id']>;
  declare price: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare foodType?: NonAttribute<FoodType>;
  declare nameLoc?: NonAttribute<LocString>;
  declare descriptionLoc?: NonAttribute<LocString>;
  declare foodComponents?: NonAttribute<FoodComponent[]>;
  declare gallery?: NonAttribute<FoodPicture[]>;
}


export type FoodData = Omit<InferAttributes<Food>, PropertiesCreationOptional>
  & { id: number; };

  
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