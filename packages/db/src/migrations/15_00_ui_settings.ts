import type { MigrationContext } from '../types/Migrations.js';
import { isUiSettingComponentGroup, isUiSettingTheme } from '@m-market-app/shared-constants';
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
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isUiSettingGroupComponentValidator(value: unknown) {
          if (!isUiSettingComponentGroup(value)) {
            throw new Error(`Invalid ui setting component group: ${value}`);
          }
        }
      },
      unique: 'unique_ui_setting'
    },
    theme: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isUiSettingThemeValidator(value: unknown) {
          if (!isUiSettingTheme(value)) {
            throw new Error(`Invalid ui setting theme: ${value}`);
          }
        }
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