import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import type { PropertiesCreationOptional } from '@m-cafe-app/shared-constants';
import type { Sequelize } from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Food } from './Food.js';
import { Ingredient } from './Ingredient.js';
import { LocString } from './LocString.js';


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


export const initFoodComponentModel = async (dbInstance: Sequelize) => {

  const includeFoodComponentData = [
    {
      model: Food,
      as: 'food',
      attributes: {
        exclude: ['nameLocId', 'descriptionLocId', 'foodTypeId', 'price', 'createdAt', 'updatedAt']
      },
      include: [
        {
          model: LocString,
          as: 'nameLoc',
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
        {
          model: LocString,
          as: 'descriptionLoc',
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }
      ]
    },
    {
      model: Ingredient,
      as: 'ingredient',
      attributes: {
        exclude: ['nameLocId', 'stockMeasureLocId', 'createdAt', 'updatedAt']
      },
      include: [
        {
          model: LocString,
          as: 'nameLoc',
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
        {
          model: LocString,
          as: 'stockMeasureLoc',
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        }
      ]
    }
  ];

  return new Promise<void>((resolve, reject) => {
    try {
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
        sequelize: dbInstance,
        underscored: true,
        timestamps: true,
        modelName: 'food_component',
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
          include: includeFoodComponentData
        },
        scopes: {
          compositeFood: {
            where: {
              compositeFood: true
            },
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          },
          simpleFood: {
            where: {
              compositeFood: false
            },
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          },
          all: {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
            include: includeFoodComponentData
          },
          allWithTimestamps: {}
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};