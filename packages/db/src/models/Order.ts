import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import type { PropertiesCreationOptional } from '@m-cafe-app/shared-constants';
import type { Sequelize } from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { User } from './User.js';
import { Address } from './Address.js';
import { OrderFood } from './OrderFood.js';
import { Facility } from './Facility.js';


export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']> | null;
  declare addressId: ForeignKey<Address['id']> | null;
  declare facilityId: ForeignKey<Facility['id']>;
  declare deliverAt: Date;
  declare status: string;
  declare totalCost: number;
  declare archiveAddress: string;
  declare customerName?: string;
  declare customerPhonenumber: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare user?: NonAttribute<User>;
  declare address?: NonAttribute<Address>;
  declare orderFoods?: NonAttribute<OrderFood[]>;
  declare facility?: NonAttribute<Facility>;
}


export type OrderData = Omit<InferAttributes<Order>, PropertiesCreationOptional>
  & { id: number; };


export const initOrderModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Order.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
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
        facilityId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'facilities', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        deliverAt: {
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
            isDate: true
          }
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false
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
          allowNull: true
        },
        customerPhonenumber: {
          type: DataTypes.STRING,
          allowNull: false
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
        scopes: {
          all: {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
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