import type { MigrationContext } from '../types/Migrations.js';
import { UiSettingTheme, componentGroups } from '@m-cafe-app/shared-constants';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('ui_settings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // if null, it means it is a global ui setting
      references: { model: 'organizations', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      unique: 'unique_ui_setting'
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
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
        isIn: [Object.values(UiSettingTheme)]
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
        fields: ['name', 'group', 'theme', 'organization_id']
      }
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('ui_settings');
};