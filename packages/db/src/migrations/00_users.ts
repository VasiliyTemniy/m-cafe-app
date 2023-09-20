import type { MigrationContext } from '../types/MigrationContext.js';
import { DataTypes } from 'sequelize';
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
        isDate: true
      }
    },
    rights: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
      validate: {
        isIn: [[...possibleUserRights]]
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('users');
};