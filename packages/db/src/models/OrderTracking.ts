import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  CreationOptional,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { MassEnum, OrderTrackingStatus } from '@m-cafe-app/shared-constants';
import { Carrier } from './Carrier.js';
import { Order } from './Order.js';
import { Facility } from './Facility.js';


export class OrderTracking extends Model<InferAttributes<OrderTracking>, InferCreationAttributes<OrderTracking>> {
  declare orderId: ForeignKey<Order['id']>;
  declare facilityId: ForeignKey<Facility['id']>;
  declare status: OrderTrackingStatus;
  declare pointNumber: number;
  declare estimatedDeliveryAt: Date;
  declare massControlValue: number | null;
  declare massMeasure: MassEnum | null;
  declare deliveredAt: Date | null;
  declare carrierId: ForeignKey<Carrier['id']> | null;
  declare order?: NonAttribute<Order>;
  declare facility?: NonAttribute<Facility>;
  declare carrier?: NonAttribute<Carrier>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initOrderTrackingModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      OrderTracking.init({
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: { model: 'orders', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        facilityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: { model: 'facilities', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [Object.values(OrderTrackingStatus)]
          },
          defaultValue: OrderTrackingStatus.Acquired
        },
        pointNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          defaultValue: 0
        },
        estimatedDeliveryAt: {
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
            isDate: true
          }
        },
        massControlValue: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        massMeasure: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            isIn: [Object.values(MassEnum)]
          }
        },
        deliveredAt: {
          type: DataTypes.DATE,
          allowNull: true,
          validate: {
            isDate: true
          }
        },
        carrierId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'carriers', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL'
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: true,
        modelName: 'order_tracking',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initOrderTrackingAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      OrderTracking.belongsTo(Order, {
        targetKey: 'id',
        foreignKey: 'orderId',
        as: 'order'
      });

      OrderTracking.belongsTo(Facility, {
        targetKey: 'id',
        foreignKey: 'facilityId',
        as: 'facility'
      });

      OrderTracking.belongsTo(Carrier, {
        targetKey: 'id',
        foreignKey: 'carrierId',
        as: 'carrier'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};