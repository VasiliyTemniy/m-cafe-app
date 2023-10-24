import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import type { PropertiesCreationOptional } from '@m-cafe-app/shared-constants';
import type { Sequelize } from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Food } from './Food.js';
import { LocString } from './LocString.js';


export class FoodType extends Model<InferAttributes<FoodType>, InferCreationAttributes<FoodType>> {
  declare id: CreationOptional<number>;
  declare nameLocId: ForeignKey<LocString['id']>;
  declare descriptionLocId: ForeignKey<LocString['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare nameLoc?: NonAttribute<LocString>;
  declare descriptionLoc?: NonAttribute<LocString>;
  declare foodTypeFoods?: NonAttribute<Food>[];
}


export type FoodTypeData = Omit<InferAttributes<FoodType>, PropertiesCreationOptional>
  & { id: number; };


export const initFoodTypeModel = (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      FoodType.init({
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
        descriptionLocId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'loc_strings', key: 'id' }
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
        modelName: 'food_type',
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
        scopes: {
          all: {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
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
          raw: {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
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