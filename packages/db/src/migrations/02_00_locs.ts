import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('locs', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      unique: true
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('locs');
};