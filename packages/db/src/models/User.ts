import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin
} from 'sequelize';
import { Model, DataTypes, Op } from 'sequelize';
import {
  ContactParentType,
  PictureParentType,
  UserRights,
  emailRegExp,
  isUserRights,
  maxEmailLen,
  maxNameLen,
  maxPhonenumberLen,
  maxUsernameLen,
  minEmailLen,
  minNameLen,
  minPhonenumberLen,
  minUsernameLen,
  nameRegExp,
  phonenumberRegExp,
  usernameRegExp
} from '@m-cafe-app/shared-constants';
import { UserAddress } from './UserAddress.js';
import { Address } from './Address.js';
import { Order } from './Order.js';
import { Review } from './Review.js';
import { Picture } from './Picture.js';
import { Role } from './Role.js';
import { UserRole } from './UserRole.js';
import { OrganizationManager } from './OrganizationManager.js';
import { Organization } from './Organization.js';
import { Contact } from './Contact.js';


export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare phonenumber: string;
  declare rights: CreationOptional<UserRights>;
  declare lookupHash: string;
  declare lookupNoise: number;
  declare username: string | null;
  declare firstName: string | null;
  declare secondName: string | null;
  declare thirdName: string | null;
  declare email: string | null;
  declare birthdate: Date | null;
  declare bannedReason: string | null;
  declare addresses?: NonAttribute<Address[]>;
  declare orders?: NonAttribute<Order[]>;
  declare reviews?: NonAttribute<Review[]>;
  declare pictures?: NonAttribute<Picture[]>;
  declare roles?: NonAttribute<Role[]>;
  declare contacts?: NonAttribute<Contact[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare addAddress: HasManyAddAssociationMixin<Address, number>;
  declare getAddresses: HasManyGetAssociationsMixin<Address>;
  declare removeAddress: HasManyRemoveAssociationMixin<Address, number>;
}


export const initUserModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      User.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        phonenumber: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
          validate: {
            is: [phonenumberRegExp, 'i'],
            len: [minPhonenumberLen, maxPhonenumberLen]
          }
        },
        rights: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: UserRights.Customer,
          validate: {
            isUserRightsValidator(value: unknown) {
              if (!isUserRights(value)) {
                throw new Error(`Invalid user rights: ${value}`);
              }
            }
          },
        },
        lookupHash: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false
        },
        lookupNoise: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        username: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: true,
          validate: {
            is: [usernameRegExp, 'i'],
            len: [minUsernameLen, maxUsernameLen]
          }
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            is: [nameRegExp, 'i'],
            len: [minNameLen, maxNameLen]
          }
        },
        secondName: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            is: [nameRegExp, 'i'],
            len: [minNameLen, maxNameLen]
          }
        },
        thirdName: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            is: [nameRegExp, 'i'],
            len: [minNameLen, maxNameLen]
          }
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: true,
          validate: {
            is: [emailRegExp, 'i'],
            len: [minEmailLen, maxEmailLen]
          }
        },
        birthdate: {
          type: DataTypes.DATE,
          allowNull: true,
          validate: {
            isDate: true
          }
        },
        bannedReason: {
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
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: true,
        paranoid: true,
        modelName: 'user',
        defaultScope: {
          where: {
            rights: {
              [Op.ne]: UserRights.Disabled
            }
          },
          attributes: {
            exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
          }
        },
        scopes: {
          raw: {
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'deletedAt']
            },
            paranoid: false
          }
        }
      });    

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initUserAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      User.belongsToMany(Address, {
        through: UserAddress,
        foreignKey: 'userId',
        otherKey: 'addressId',
        as: 'addresses'
      });

      User.belongsToMany(Organization, {
        through: OrganizationManager,
        foreignKey: 'userId',
        otherKey: 'organizationId',
        as: 'manager',
      });

      User.hasMany(Order, {
        foreignKey: 'userId',
        as: 'orders'
      });

      User.hasMany(Review, {
        foreignKey: 'userId',
        as: 'reviews'
      });

      User.hasMany(Picture, {
        foreignKey: 'parentId',
        as: 'pictures',
        scope: {
          parentType: PictureParentType.User
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      User.belongsToMany(Role, {
        through: UserRole,
        foreignKey: 'userId',
        otherKey: 'roleId',
        as: 'roles'
      });

      User.hasMany(Contact, {
        foreignKey: 'parentId',
        as: 'contacts',
        scope: {
          parentType: ContactParentType.User
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


export const initUserScopes = async () => {

  const includeAddresses = {
    model: Address,
    as: 'addresses',
    through: {
      attributes: []
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  };

  return new Promise<void>((resolve, reject) => {
    try {

      User.addScope('customer', {
        where: {
          rights: {
            [Op.eq]: UserRights.Customer
          }
        },
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
        }
      });

      User.addScope('appAdmin', {
        where: {
          rights: {
            [Op.eq]: UserRights.AppAdmin
          }
        },
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
        }
      });

      User.addScope('orgAdmin', {
        where: {
          rights: {
            [Op.eq]: UserRights.OrgAdmin
          }
        },
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
        }
      });

      User.addScope('manager', {
        where: {
          rights: {
            [Op.eq]: UserRights.Manager
          }
        },
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
        }
      });

      User.addScope('disabled', {
        where: {
          rights: {
            [Op.eq]: UserRights.Disabled
          }
        },
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
        }
      });

      User.addScope('deleted', {
        where: {
          deletedAt: {
            [Op.not]: {
              [Op.is]: undefined
            }
          }
        },
        attributes: {
          exclude: ['passwordHash']
        },
        paranoid: false
      });

      User.addScope('all', {
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
        },
        paranoid: false
      });

      User.addScope('allWithAddresses', {
        include: [includeAddresses],
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
        },
        paranoid: false
      });

      User.addScope('allWithTimestamps', {
        attributes: {
          exclude: ['passwordHash']
        },
        paranoid: false
      });

      User.addScope('lookupHashRights', {
        attributes: {
          exclude: ['firstName', 'secondName', 'thirdName', 'username', 'phonenumber', 'email', 'birthdate', 'bannedReason', 'createdAt', 'updatedAt', 'deletedAt']
        },
        paranoid: false
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};