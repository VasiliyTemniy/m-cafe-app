import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Order } from './Order.js';
import { OrderTracking } from './OrderTracking.js';
import { ContactParentType } from '@m-cafe-app/shared-constants';
import { Contact } from './Contact.js';


export class Carrier extends Model<InferAttributes<Carrier>, InferCreationAttributes<Carrier>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare orders?: NonAttribute<Order[]>;
  declare contacts?: NonAttribute<Contact[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initCarrierModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Carrier.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false
        },
        // contacts are referenced from contacts table
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
        modelName: 'carrier',
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
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


export const initCarrierAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Carrier.belongsToMany(Order, {
        through: OrderTracking,
        sourceKey: 'id',
        foreignKey: 'carrierId',
        as: 'orders'
      });

      Carrier.hasMany(Contact, {
        foreignKey: 'parentId',
        as: 'contacts',
        scope: {
          parentType: ContactParentType.Carrier
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