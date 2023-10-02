import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin
} from 'sequelize';
import type { PropertiesCreationOptional } from '@m-cafe-app/shared-constants';
import { Model, DataTypes } from 'sequelize';
import Address from './Address.js';
import { sequelize } from '../db.js';
import {
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
import { Op } from 'sequelize';


export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare username?: string;
  declare name?: string;
  declare passwordHash: string;
  declare phonenumber: string;
  declare email?: string;
  declare birthdate?: Date;
  declare rights: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare addAddress: HasManyAddAssociationMixin<Address, number>;
  declare getAddresses: HasManyGetAssociationsMixin<Address>;
  declare removeAddress: HasManyRemoveAssociationMixin<Address, number>;
}


export type UserData = Omit<InferAttributes<User>, PropertiesCreationOptional | 'rights'>
  & { id: number; rights: string; };


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
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
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
  sequelize,
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
    customer: {
      where: {
        rights: {
          [Op.eq]: 'customer'
        }
      },
      attributes: {
        exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
      }
    },
    admin: {
      where: {
        rights: {
          [Op.eq]: 'admin'
        }
      },
      attributes: {
        exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
      }
    },
    manager: {
      where: {
        rights: {
          [Op.eq]: 'manager'
        }
      },
      attributes: {
        exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
      }
    },
    disabled: {
      where: {
        rights: {
          [Op.eq]: 'disabled'
        }
      },
      attributes: {
        exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
      }
    },
    deleted: {
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
    },
    all: {
      attributes: {
        exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
      },
      paranoid: false
    },
    allWithTimestamps: {
      paranoid: false
    },
    allWithPasswordHash: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt']
      },
      paranoid: false
    }
  }
});
  
export default User;