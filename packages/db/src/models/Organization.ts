import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
  Sequelize
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import {
  ContactParentType,
  DetailGroupParentType,
  LocParentType,
  LocType,
  orgDefaultMaxDetails,
  orgDefaultMaxDynamicModules,
  orgDefaultMaxEvents,
  orgDefaultMaxManagers,
  orgDefaultMaxPermissions,
  orgDefaultMaxPictures,
  orgDefaultMaxPolicies,
  orgDefaultMaxProducts,
  orgDefaultMaxRoles,
  orgDefaultMaxTags
} from '@m-cafe-app/shared-constants';
import { Loc } from './Loc.js';
import { User } from './User.js';
import { Contact } from './Contact.js';
import { DetailGroup } from './DetailGroup.js';


export class Organization extends Model<InferAttributes<Organization>, InferCreationAttributes<Organization>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare orgAdminId: ForeignKey<User['id']>;
  declare maxPolicies: CreationOptional<number>;
  declare maxManagers: CreationOptional<number>;
  declare maxProducts: CreationOptional<number>;
  declare maxPictures: CreationOptional<number>;
  declare maxDetails: CreationOptional<number>;
  declare maxDynamicModules: CreationOptional<number>;
  declare maxEvents: CreationOptional<number>;
  declare maxRoles: CreationOptional<number>;
  declare maxPermissions: CreationOptional<number>;
  declare maxTags: CreationOptional<number>;
  declare usedPolicies: CreationOptional<number>;
  declare usedManagers: CreationOptional<number>;
  declare usedProducts: CreationOptional<number>;
  declare usedPictures: CreationOptional<number>;
  declare usedDetails: CreationOptional<number>;
  declare usedDynamicModules: CreationOptional<number>;
  declare usedEvents: CreationOptional<number>;
  declare usedRoles: CreationOptional<number>;
  declare usedPermissions: CreationOptional<number>;
  declare usedTags: CreationOptional<number>;
  declare descriptionLocs?: NonAttribute<Loc>[];
  declare orgAdmin?: NonAttribute<User>;
  declare contacts?: NonAttribute<Contact[]>;
  declare detailGroups?: NonAttribute<DetailGroup[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initOrganizationModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Organization.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        // Organization name should not be localized
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        // description locs are referenced from locs table
        // contacts are referenced from contacts table
        orgAdminId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        maxPolicies: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: orgDefaultMaxPolicies
        },
        maxManagers: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: orgDefaultMaxManagers
        },
        maxProducts: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: orgDefaultMaxProducts
        },
        maxPictures: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: orgDefaultMaxPictures
        },
        maxDetails: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: orgDefaultMaxDetails
        },
        maxDynamicModules: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: orgDefaultMaxDynamicModules
        },
        maxEvents: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: orgDefaultMaxEvents
        },
        maxRoles: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: orgDefaultMaxRoles
        },
        maxPermissions: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: orgDefaultMaxPermissions
        },
        maxTags: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: orgDefaultMaxTags
        },
        usedPolicies: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        usedManagers: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        usedProducts: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        usedPictures: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        usedDetails: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        usedDynamicModules: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        usedEvents: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        usedRoles: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        usedPermissions: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        usedTags: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: true,
        modelName: 'organization',
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


export const initOrganizationAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Organization.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'descriptionLocs',
        scope: {
          parentType: LocParentType.Organization,
          locType: LocType.Name
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Organization.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'orgAdminId',
        as: 'orgAdmin',
      });

      Organization.hasMany(Contact, {
        foreignKey: 'parentId',
        as: 'contacts',
        scope: {
          parentType: ContactParentType.Organization
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      Organization.hasMany(DetailGroup, {
        foreignKey: 'parentId',
        as: 'detailGroups',
        scope: {
          parentType: DetailGroupParentType.Organization
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