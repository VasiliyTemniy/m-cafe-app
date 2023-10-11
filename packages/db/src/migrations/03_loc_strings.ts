import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('loc_strings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    main_str: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    sec_str: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    alt_str: {
      type: DataTypes.STRING(5000),
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
  await queryInterface.dropTable('loc_strings');
};