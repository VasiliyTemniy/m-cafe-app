import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';
import {
  UserRights,
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
} from '@m-cafe-app/shared-constants';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('users', {
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
      // validate: {
      //   isIn: [Object.values(UserRights)]
      // }
    },
    lookup_hash: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    lookup_noise: {
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
    first_name: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: [nameRegExp, 'i'],
        len: [minNameLen, maxNameLen]
      }
    },
    second_name: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: [nameRegExp, 'i'],
        len: [minNameLen, maxNameLen]
      }
    },
    third_name: {
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
    banned_reason: {
      type: DataTypes.STRING,
      allowNull: true
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