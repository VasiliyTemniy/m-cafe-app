import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('products', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // name and description locs are referenced from locs table
    product_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'product_types', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_mass: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_volume: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    box_sizing_x: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    box_sizing_y: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    box_sizing_z: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // product categories are handled in many-many junction table
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
  await queryInterface.dropTable('products');
};