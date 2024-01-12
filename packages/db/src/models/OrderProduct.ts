import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import type { Order } from './Order.js';
import type { Product } from './Product.js';
import { Model, DataTypes } from 'sequelize';


export class OrderProduct extends Model<InferAttributes<OrderProduct>, InferCreationAttributes<OrderProduct>> {
  declare orderId: ForeignKey<Order['id']>;
  declare productId: ForeignKey<Product['id']> | null;
  declare archiveProductId: number;
  declare quantity: number;
  declare archivePrice: number;
  declare archiveName: string;
  declare archiveTotalCuts: number;
  declare archiveDiscountCuts: number;
  declare archiveEventCuts: number;
  declare archiveBonusCuts: number;
  declare archiveBonusGains: number;
  declare product?: NonAttribute<Product>;
}


export const initOrderProductModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      OrderProduct.init({
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: { model: 'orders', key: 'id' }
        },
        productId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'products', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        archiveProductId: {
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
        archiveName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        archiveTotalCuts: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        archiveDiscountCuts: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        archiveEventCuts: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        archiveBonusCuts: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        archiveBonusGains: {
          type: DataTypes.INTEGER,
          allowNull: false
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'order_product',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};