import type { MigrationContext } from '../types/Migrations.js';
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