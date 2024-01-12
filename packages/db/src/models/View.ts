import type {
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  Sequelize
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Picture } from './Picture.js';
import { ViewParentType, isViewParentType } from '@m-market-app/shared-constants';
import { Product } from './Product.js';


export class View extends Model<InferAttributes<View>, InferCreationAttributes<View>> {
  declare userIp: string;
  declare parentId: number;
  declare parentType: ViewParentType;
  declare count: number;
  declare product?: NonAttribute<Product>;
  declare picture?: NonAttribute<Picture>;
}


export const initViewModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      View.init({
        userIp: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false
        },
        parentId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        parentType: {
          type: DataTypes.SMALLINT,
          primaryKey: true,
          allowNull: false,
          validate: {
            isViewParentTypeValidator(value: unknown) {
              if (!isViewParentType(value)) {
                throw new Error(`Invalid view parent type: ${value}`);
              }
            }
          },
        },
        count: {
          type: DataTypes.INTEGER,
          allowNull: false,
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'view',
      });
      
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initViewAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      View.belongsTo(Picture, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'picture',
        scope: {
          parentType: ViewParentType.Picture
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      View.belongsTo(Product, {
        foreignKey: 'parentId',
        targetKey: 'id',
        as: 'product',
        scope: {
          parentType: ViewParentType.Product
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