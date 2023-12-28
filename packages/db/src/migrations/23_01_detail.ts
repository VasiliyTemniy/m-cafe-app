import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('details', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    detail_group_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'detail_groups', key: 'id' },
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
    // name and value locs are referenced from locs table
    // Search and filter for Products can be done through semantic values
    semantic_value_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'semantic_values', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    // Semantic value numeric is a supplementary column that can represent, e.g. 1000 rpm for some engines or 270.5 C as a melting point for some materials
    // If null, semantic value numeric is not applicable
    semantic_value_numeric: {
      type: DataTypes.FLOAT,
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
  await queryInterface.dropTable('details');
};