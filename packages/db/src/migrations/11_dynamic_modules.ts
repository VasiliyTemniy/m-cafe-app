import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';
import { DynamicModuleType, DynamicModulePlacementType } from '@m-cafe-app/shared-constants';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('dynamic_modules', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    module_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(DynamicModuleType)]
      }
    },
    // locs are referenced from locs table
    page: {
      type: DataTypes.STRING,
      allowNull: false
    },
    placement: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    placement_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(DynamicModulePlacementType)]
      },
      defaultValue: DynamicModulePlacementType.BeforeMenu
    },    
    class_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    inline_css: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url: {
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
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('dynamic_modules');
};