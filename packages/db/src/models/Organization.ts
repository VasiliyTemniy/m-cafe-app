import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey,
  Sequelize
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { ContactParentType, DetailGroupParentType, LocParentType, LocType } from '@m-cafe-app/shared-constants';
import { Loc } from './Loc.js';
import { User } from './User.js';
import { Contact } from './Contact.js';
import { DetailGroup } from './DetailGroup.js';


export class Organization extends Model<InferAttributes<Organization>, InferCreationAttributes<Organization>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare orgAdminId: ForeignKey<User['id']>;
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