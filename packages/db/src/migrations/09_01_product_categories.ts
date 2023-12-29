import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('product_categories', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    // name and description locs are referenced from locs table
    product_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'product_types', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    parent_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'product_categories', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    nest_level: {
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
  await queryInterface.dropTable('product_categories');
};