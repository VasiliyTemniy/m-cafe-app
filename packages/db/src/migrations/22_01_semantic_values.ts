import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('semantic_values', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    semantic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'semantics', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      unique: 'unique_semantic_value'
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    // value and description locs are referenced from locs table
    // technical value that should not be shown to customers and should be localized
    technical_value: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'unique_semantic_value'
    }
  }, {
    uniqueKeys: {
      unique_semantic_value: {
        fields: ['semantic_id', 'technical_value']
      }
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('semantic_values');
};