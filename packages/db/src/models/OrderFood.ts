import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import type { PropertiesCreationOptional } from '@m-cafe-app/shared-constants';
import type { Sequelize } from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Food } from './Food.js';
import { Order } from './Order.js';

export class OrderFood extends Model<InferAttributes<OrderFood>, InferCreationAttributes<OrderFood>> {
  declare id: CreationOptional<number>;
  declare orderId: ForeignKey<Order['id']>;
  declare foodId: ForeignKey<Food['id']> | null;
  declare amount: number;
  declare archivePrice: number;
  declare archiveFoodName: string;
  declare food?: NonAttribute<Food>;
}


export type OrderFoodData = Omit<InferAttributes<OrderFood>, PropertiesCreationOptional>
  & { id: number; };


export const initOrderFoodModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      OrderFood.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'orders', key: 'id' }
        },
        foodId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'foods', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        amount: {
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
        modelName: 'order_food'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};