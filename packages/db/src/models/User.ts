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
  PictureParentType,
  emailRegExp,
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
  possibleUserRights,
  usernameRegExp
} from '@m-cafe-app/shared-constants';
import { UserAddress } from './UserAddress.js';
import { Address } from './Address.js';
import { FacilityManager } from './FacilityManager.js';
import { Facility } from './Facility.js';
import { Order } from './Order.js';
import { Review } from './Review.js';
import { Picture } from './Picture.js';


export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare phonenumber: string;
  declare rights: CreationOptional<string>;
  declare lookupHash: string;
  declare username: string | null;
  declare name: string | null;
  declare email: string | null;
  declare birthdate: Date | null;
  declare lookupNoise: number | null;
  declare addresses?: NonAttribute<Address[]>;
  declare orders?: NonAttribute<Order[]>;
  declare reviews?: NonAttribute<Review[]>;
  declare pictures?: NonAttribute<Picture[]>;
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
        username: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: true,
          validate: {
            is: [usernameRegExp, 'i'],
            len: [minUsernameLen, maxUsernameLen]
          }
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            is: [nameRegExp, 'i'],
            len: [minNameLen, maxNameLen]
          }
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
        rights: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'customer',
          validate: {
            isIn: [[...possibleUserRights]]
          }
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
              [Op.ne]: 'disabled'
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

      // Through table associations: uncomment if needed
      // User.hasMany(UserAddress, {
      //   foreignKey: 'userId',
      //   as: 'userAddresses'
      // });
      // UserAddress.belongsTo(User, {
      //   targetKey: 'id',
      //   foreignKey: 'userId'
      // });

      User.belongsToMany(Facility, {
        through: FacilityManager,
        foreignKey: 'userId',
        otherKey: 'facilityId',
        as: 'manager',
      });

      // Through table associations: uncomment if needed
      // User.hasMany(FacilityManager, {
      //   foreignKey: 'userId',
      //   as: 'managerOfAFacility',
      // });
      // FacilityManager.belongsTo(User, {
      //   targetKey: 'id',
      //   foreignKey: 'userId'
      // });

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
            [Op.eq]: 'customer'
          }
        },
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
        }
      });

      User.addScope('admin', {
        where: {
          rights: {
            [Op.eq]: 'admin'
          }
        },
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
        }
      });

      User.addScope('manager', {
        where: {
          rights: {
            [Op.eq]: 'manager'
          }
        },
        attributes: {
          exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
        }
      });

      User.addScope('disabled', {
        where: {
          rights: {
            [Op.eq]: 'disabled'
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

      User.addScope('passwordHashRights', {
        attributes: {
          exclude: ['name', 'username', 'phonenumber', 'email', 'birthdate', 'createdAt', 'updatedAt', 'deletedAt']
        },
        paranoid: false
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};