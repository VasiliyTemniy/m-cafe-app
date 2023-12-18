import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { FacilityType, LocParentType, LocType, PictureParentType, ReviewParentType } from '@m-cafe-app/shared-constants';
import { Order } from './Order.js';
import { Address } from './Address.js';
import { Loc } from './Loc.js';
import { Stock } from './Stock.js';
import { User } from './User.js';
import { FacilityManager } from './FacilityManager.js';
import { OrderTracking } from './OrderTracking.js';
import { Picture } from './Picture.js';
import { Review } from './Review.js';


export class Facility extends Model<InferAttributes<Facility>, InferCreationAttributes<Facility>> {
  declare id: CreationOptional<number>;
  declare addressId: ForeignKey<Address['id']>;
  declare facilityType: string;
  declare address?: NonAttribute<Address>;  
  declare nameLocs?: NonAttribute<Loc[]>;
  declare descriptionLocs?: NonAttribute<Loc[]>;
  declare managers?: NonAttribute<User[]>;
  declare stocks?: NonAttribute<Stock[]>;
  declare orders?: NonAttribute<Order[]>;
  declare transitOrders?: NonAttribute<OrderTracking[]>;
  declare reviews?: NonAttribute<Review[]>;
  declare pictures?: NonAttribute<Picture[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initFacilityModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Facility.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        addressId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'addresses', key: 'id' },
        },
        // name and description locs are referenced from locs table
        facilityType: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [Object.values(FacilityType)]
          }
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
        modelName: 'facility',
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
        // See initFacilityScopes.ts for more
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


export const initFacilityAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Facility.belongsTo(Address, {
        targetKey: 'id',
        foreignKey: 'addressId',
        as: 'address'
      });

      Facility.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'nameLocs',
        scope: {
          parentType: LocParentType.Facility,
          locType: LocType.Name
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Facility.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'descriptionLocs',
        scope: {
          parentType: LocParentType.Facility,
          locType: LocType.Description
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Facility.belongsToMany(User, {
        through: FacilityManager,
        foreignKey: 'facilityId',
        as: 'managers'
      });

      Facility.hasMany(Stock, {
        foreignKey: 'facilityId',
        as: 'stocks'
      });

      Facility.hasMany(Order, {
        foreignKey: 'facilityId',
        as: 'orders'
      });

      Facility.hasMany(OrderTracking, {
        foreignKey: 'facilityId',
        as: 'transitOrders'
      });

      Facility.hasMany(Picture, {
        foreignKey: 'parentId',
        as: 'pictures',
        scope: {
          parentType: PictureParentType.Facility
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Facility.hasMany(Review, {
        foreignKey: 'parentId',
        as: 'reviews',
        scope: {
          parentType: ReviewParentType.Facility
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