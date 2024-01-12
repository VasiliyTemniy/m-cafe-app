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
  ContactParentType,
  DetailGroupParentType,
  FacilityType,
  LocParentType,
  LocType,
  PictureParentType,
  ReviewParentType,
  TagParentType,
  isFacilityType
} from '@m-market-app/shared-constants';
import { Order } from './Order.js';
import { Address } from './Address.js';
import { Loc } from './Loc.js';
import { Stock } from './Stock.js';
import { User } from './User.js';
import { OrderTracking } from './OrderTracking.js';
import { Picture } from './Picture.js';
import { Review } from './Review.js';
import { Organization } from './Organization.js';
import { Contact } from './Contact.js';
import { DetailGroup } from './DetailGroup.js';
import { TagRelation } from './TagRelation.js';
import { Tag } from './Tag.js';


export class Facility extends Model<InferAttributes<Facility>, InferCreationAttributes<Facility>> {
  declare id: CreationOptional<number>;
  declare organizationId: ForeignKey<Organization['id']>;
  declare createdBy: ForeignKey<User['id']>;
  declare updatedBy: ForeignKey<User['id']>;
  declare addressId: ForeignKey<Address['id']>;
  declare facilityType: FacilityType;
  declare address?: NonAttribute<Address>;  
  declare nameLocs?: NonAttribute<Loc[]>;
  declare descriptionLocs?: NonAttribute<Loc[]>;
  declare managers?: NonAttribute<User[]>;
  declare stocks?: NonAttribute<Stock[]>;
  declare orders?: NonAttribute<Order[]>;
  declare transitOrders?: NonAttribute<OrderTracking[]>;
  declare reviews?: NonAttribute<Review[]>;
  declare pictures?: NonAttribute<Picture[]>;
  declare contacts?: NonAttribute<Contact[]>;
  declare detailGroups?: NonAttribute<DetailGroup[]>;
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
        organizationId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'organizations', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        updatedBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        addressId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'addresses', key: 'id' },
        },
        // name and description locs are referenced from locs table
        // contacts are referenced from contacts table
        facilityType: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isFacilityTypeValidator(value: unknown) {
              if (!isFacilityType(value)) {
                throw new Error(`Invalid facility type: ${value}`);
              }
            }
          },
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
        scopes: {
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

      Facility.belongsTo(Organization, {
        targetKey: 'id',
        foreignKey: 'organizationId',
        as: 'organization',
      });

      Facility.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'createdBy',
        as: 'createdByAuthor',
      });

      Facility.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByAuthor',
      });

      Facility.hasMany(Contact, {
        foreignKey: 'parentId',
        as: 'contacts',
        scope: {
          parentType: ContactParentType.Facility
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Facility.hasMany(DetailGroup, {
        foreignKey: 'parentId',
        as: 'detailGroups',
        scope: {
          parentType: DetailGroupParentType.Facility
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Facility.belongsToMany(Tag, {
        through: {
          model: TagRelation,
          scope: {
            parentType: TagParentType.Facility
          },
        },
        foreignKey: 'parentId',
        otherKey: 'tagId',
        as: 'tags',
        constraints: false,
        foreignKeyConstraint: false
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};