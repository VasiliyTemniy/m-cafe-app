import type {
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
  Sequelize
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Picture } from './Picture.js';
import { ViewEntityType } from '@m-cafe-app/shared-constants';
import { Product } from './Product.js';


export class View extends Model<InferAttributes<View>, InferCreationAttributes<View>> {
  declare userIp: string;
  declare entityId: number;
  declare entityType: ViewEntityType;
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
        entityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        entityType: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [Object.values(ViewEntityType)],
          }
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
        foreignKey: 'entityId',
        targetKey: 'id',
        as: 'picture',
        scope: {
          entityType: ViewEntityType.Picture
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      View.belongsTo(Product, {
        foreignKey: 'entityId',
        targetKey: 'id',
        as: 'product',
        scope: {
          entityType: ViewEntityType.Product
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