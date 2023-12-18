import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import {
  CommentParentType,
  OrderDeliveryType,
  OrderPaymentMethod,
  OrderPaymentStatus,
  OrderStatus,
  ReviewParentType
} from '@m-cafe-app/shared-constants';
import { User } from './User.js';
import { Address } from './Address.js';
import { Facility } from './Facility.js';
import { OrderProduct } from './OrderProduct.js';
import { OrderTracking } from './OrderTracking.js';
import { Comment } from './Comment.js';
import { Review } from './Review.js';


export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: CreationOptional<number>;
  declare facilityId: ForeignKey<Facility['id']>;
  declare estimatedDeliveryAt: Date;
  declare deliveryType: OrderDeliveryType;
  declare status: OrderStatus;
  declare totalCost: number;
  declare archiveAddress: string;
  declare customerName: string;
  declare customerPhonenumber: string;
  declare paymentMethod: OrderPaymentMethod;
  declare paymentStatus: OrderPaymentStatus;
  declare boxSizingX: number | null;
  declare boxSizingY: number | null;
  declare boxSizingZ: number | null;
  declare userId: ForeignKey<User['id']> | null;
  declare addressId: ForeignKey<Address['id']> | null;
  declare deliverAt: Date | null;
  declare recievedAt: Date | null;
  declare massControlValue: number | null;
  declare comment: string | null;
  declare trackingCode: string | null;
  declare user?: NonAttribute<User>;
  declare address?: NonAttribute<Address>;
  declare orderProducts?: NonAttribute<OrderProduct[]>;
  declare facility?: NonAttribute<Facility>;
  declare tracking?: NonAttribute<OrderTracking[]>;
  declare disputeComments?: NonAttribute<Comment[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initOrderModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Order.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        facilityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'facilities', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        // Overall estimated order delivery time, set by the backend
        estimatedDeliveryAt: {
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
            isDate: true
          }
        },
        deliveryType: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [Object.values(OrderDeliveryType)]
          }
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [Object.values(OrderStatus)]
          },
        },
        totalCost: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        archiveAddress: {
          type: DataTypes.STRING,
          allowNull: false
        },
        customerName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        customerPhonenumber: {
          type: DataTypes.STRING,
          allowNull: false
        },
        paymentMethod: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [Object.values(OrderPaymentMethod)]
          }
        },
        paymentStatus: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [Object.values(OrderPaymentStatus)]
          }
        },
        boxSizingX: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        boxSizingY: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        boxSizingZ: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        addressId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'addresses', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        // Preferred deliver_at time, set by the customer. Makes sense for food delivery
        deliverAt: {
          type: DataTypes.DATE,
          allowNull: true,
          validate: {
            isDate: true
          }
        },
        recievedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          validate: {
            isDate: true
          }
        },
        massControlValue: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        comment: {
          type: DataTypes.STRING,
          allowNull: true
        },
        trackingCode: {
          type: DataTypes.STRING,
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
        modelName: 'order',
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
        // See initOrderScopes.ts for more
        scopes: {
          raw: {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          }
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initOrderAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Order.belongsTo(Facility, {
        foreignKey: 'facilityId',
        as: 'facility',
      });

      Order.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
      });
      
      Order.hasMany(OrderProduct, {
        foreignKey: 'orderId',
        as: 'products'
      });

      Order.hasMany(OrderTracking, {
        foreignKey: 'orderId',
        as: 'tracking'
      });

      Order.hasMany(Comment, {
        foreignKey: 'parentId',
        as: 'disputeComments',
        scope: {
          parentType: CommentParentType.Order
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Order.hasOne(Review, {
        foreignKey: 'parentId',
        as: 'review',
        scope: {
          parentType: ReviewParentType.Order
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