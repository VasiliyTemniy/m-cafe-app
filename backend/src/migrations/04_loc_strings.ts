import { DataTypes } from 'sequelize';
import { MigrationContext } from '../types/MigrationContext.js';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('loc_strings', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ru_string: {
      type: DataTypes.STRING,
      allowNull: false
    },
    en_string: {
      type: DataTypes.STRING,
      allowNull: true
    },
    alt_string: {
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
  await queryInterface.dropTable('loc_strings');
};