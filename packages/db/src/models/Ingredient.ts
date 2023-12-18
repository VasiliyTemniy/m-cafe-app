import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute
} from 'sequelize';
import { LocParentType, LocType, PictureParentType, StockEntityType } from '@m-cafe-app/shared-constants';
import { Model, DataTypes } from 'sequelize';
import { Loc } from './Loc.js';
import { Stock } from './Stock.js';
import { Picture } from './Picture.js';


export class Ingredient extends Model<InferAttributes<Ingredient>, InferCreationAttributes<Ingredient>> {
  declare id: CreationOptional<number>;
  declare unitMass: number | null;
  declare unitVolume: number | null;
  declare proteins: number | null;
  declare fats: number | null;
  declare carbohydrates: number | null;
  declare calories: number | null;
  declare nameLocs?: NonAttribute<Loc[]>;
  declare descriptionLocs?: NonAttribute<Loc[]>;
  declare stockMeasureLocs?: NonAttribute<Loc[]>;
  declare pictures?: NonAttribute<Picture[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initIngredientModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Ingredient.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        // name, description and stock measure locs are referenced from locs table
        unitMass: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        unitVolume: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        proteins: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        fats: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        carbohydrates: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        calories: {
          type: DataTypes.INTEGER,
          allowNull: true
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
        modelName: 'ingredient',
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          },
        },
        scopes: {
          all: {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            },
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


export const initIngredientAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Ingredient.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'nameLocs',
        scope: {
          parentType: LocParentType.Ingredient,
          locType: LocType.Name
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Ingredient.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'descriptionLocs',
        scope: {
          parentType: LocParentType.Ingredient,
          locType: LocType.Description
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Ingredient.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'stockMeasureLocs',
        scope: {
          parentType: LocParentType.Ingredient,
          locType: LocType.StockMeasure
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Ingredient.hasMany(Stock, {
        foreignKey: 'entityId',
        as: 'stocks',
        scope: {
          entityType: StockEntityType.Ingredient
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Ingredient.hasMany(Picture, {
        foreignKey: 'parentId',
        as: 'pictures',
        scope: {
          parentType: PictureParentType.Ingredient
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};