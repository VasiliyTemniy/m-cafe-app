import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
} from 'sequelize';
import {
  CurrencyCode,
  LocParentType,
  LocType,
  PictureParentType,
  StockEntityType,
  isCurrencyCode
} from '@m-market-app/shared-constants';
import { Model, DataTypes } from 'sequelize';
import { Loc } from './Loc.js';
import { Stock } from './Stock.js';
import { Picture } from './Picture.js';
import { Organization } from './Organization.js';
import { User } from './User.js';


export class Ingredient extends Model<InferAttributes<Ingredient>, InferCreationAttributes<Ingredient>> {
  declare id: CreationOptional<number>;
  declare organizationId: ForeignKey<Organization['id']>;
  declare createdBy: ForeignKey<User['id']>;
  declare updatedBy: ForeignKey<User['id']>;
  declare price: number | null;
  declare currencyCode: CurrencyCode | null;
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
        organizationId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'organizations', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        updatedBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        // name, description and stock measure locs are referenced from locs table
        price: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        currencyCode: {
          type: DataTypes.SMALLINT,
          allowNull: true,
          validate: {
            isCurrencyCodeValidator(value: unknown) {
              if (!value) {
                return;
              }
              if (!isCurrencyCode(value)) {
                throw new Error(`Invalid currency code: ${value}`);
              }
            }
          }
        },
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

      Ingredient.belongsTo(Organization, {
        targetKey: 'id',
        foreignKey: 'organizationId',
        as: 'organization',
      });

      Ingredient.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'createdBy',
        as: 'createdByAuthor',
      });

      Ingredient.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByAuthor',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};