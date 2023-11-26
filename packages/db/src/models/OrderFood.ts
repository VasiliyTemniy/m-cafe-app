import type { InferAttributes, InferCreationAttributes, ForeignKey, NonAttribute } from 'sequelize';
import type { PropertiesCreationOptional } from '@m-cafe-app/shared-constants';
import type { Sequelize } from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Food } from './Food.js';
import { Order } from './Order.js';
import { includeFoodSimple } from './commonIncludes.js';

export class OrderFood extends Model<InferAttributes<OrderFood>, InferCreationAttributes<OrderFood>> {
  declare orderId: ForeignKey<Order['id']>;
  declare foodId: ForeignKey<Food['id']> | null;
  declare archiveFoodId: number;
  declare quantity: number;
  declare archivePrice: number;
  declare archiveFoodName: string;
  declare food?: NonAttribute<Food>;
}


export type OrderFoodData = Omit<InferAttributes<OrderFood>, PropertiesCreationOptional>;


export const initOrderFoodModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      OrderFood.init({
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: { model: 'orders', key: 'id' }
        },
        foodId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'foods', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        archiveFoodId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        archivePrice: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        archiveFoodName: {
          type: DataTypes.STRING,
          allowNull: false
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'order_food',
        scopes: {
          withFoodSimple: {
            include: includeFoodSimple
          }
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};