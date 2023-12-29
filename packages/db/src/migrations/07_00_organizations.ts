import type { MigrationContext } from '../types/Migrations.js';
import {
  orgDefaultMaxDetails,
  orgDefaultMaxDynamicModules,
  orgDefaultMaxEvents,
  orgDefaultMaxManagers,
  orgDefaultMaxPermissions,
  orgDefaultMaxPictures,
  orgDefaultMaxPolicies,
  orgDefaultMaxProducts,
  orgDefaultMaxRoles,
  orgDefaultMaxTags
} from '@m-cafe-app/shared-constants';
import { DataTypes } from 'sequelize';


export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('organizations', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Organization name should not be localized
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // description locs are referenced from locs table
    // contacts are referenced from contacts table
    org_admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    max_policies: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: orgDefaultMaxPolicies
    },
    max_managers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: orgDefaultMaxManagers
    },
    max_products: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: orgDefaultMaxProducts
    },
    max_pictures: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: orgDefaultMaxPictures
    },
    max_details: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: orgDefaultMaxDetails
    },
    max_dynamic_modules: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: orgDefaultMaxDynamicModules
    },
    max_events: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: orgDefaultMaxEvents
    },
    max_roles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: orgDefaultMaxRoles
    },
    max_permissions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: orgDefaultMaxPermissions
    },
    max_tags: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: orgDefaultMaxTags
    },
    used_policies: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    used_managers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    used_products: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    used_pictures: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    used_details: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    used_dynamic_modules: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    used_events: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    used_roles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    used_permissions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    used_tags: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
  await queryInterface.dropTable('organizations');
};