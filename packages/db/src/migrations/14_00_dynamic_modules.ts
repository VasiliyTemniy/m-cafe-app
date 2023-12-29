import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';
// import { DynamicModuleType, DynamicModulePlacementType, DynamicModulePreset } from '@m-cafe-app/shared-constants';
import { DynamicModulePlacementType } from '@m-cafe-app/shared-constants';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('dynamic_modules', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // if null, it means it is a global module
      references: { model: 'organizations', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    module_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      // validate: {
      //   isIn: [Object.values(DynamicModuleType)]
      // }
    },
    placement: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    placement_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      // validate: {
      //   isIn: [Object.values(DynamicModulePlacementType)]
      // },
      defaultValue: DynamicModulePlacementType.BeforeMenu
    },
    nest_level: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    preset: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      // validate: {
      //   isIn: [Object.values(DynamicModulePreset)]
      // }
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
    parent_dynamic_module_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'dynamic_modules', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
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