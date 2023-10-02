import type { MigrationContext } from '../types/MigrationContext.js';
import { allowedThemes, componentGroups } from '@m-cafe-app/shared-constants';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('ui_settings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'unique_ui_setting'
    },
    group: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [componentGroups]
      },
      unique: 'unique_ui_setting'
    },
    theme: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [allowedThemes]
      },
      unique: 'unique_ui_setting'
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    uniqueKeys: {
      unique_ui_setting: {
        customIndex: true,
        fields: ['name', 'group', 'theme']
      }
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('ui_settings');
};