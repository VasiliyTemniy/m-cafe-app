import { DataTypes } from 'sequelize';
import { MigrationContext } from '../types/MigrationContext.js';
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

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('users', {
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
    password_hash: {
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
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('users');
};