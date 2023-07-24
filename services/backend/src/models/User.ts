import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

import { sequelize } from '../utils/db.js';

import {
  dateRegExp,
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
  usernameRegExp
} from '../utils/constants.js';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare username: CreationOptional<string>;
  declare name: CreationOptional<string>;
  declare passwordHash: string;
  declare phonenumber: string;
  declare email: CreationOptional<string>;
  declare birthdate: CreationOptional<Date>;
  declare disabled: CreationOptional<boolean>;
  declare admin: CreationOptional<boolean>;
}

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
      is: [dateRegExp, 'i']
    }
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  admin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user',
  defaultScope: {
    where: {
      disabled: false
    }
  },
  scopes: {
    admin: {
      where: {
        admin: true
      }
    },
    disabled: {
      where: {
        disabled: true
      }
    },
    all: {}
  }
});

export default User;