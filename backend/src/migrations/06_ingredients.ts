import { DataTypes } from 'sequelize';
import { MigrationContext } from '../types/umzugContext.js';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('ingredients', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stock_measure: {
      type: DataTypes.STRING,
      allowNull: false
    },
    proteins: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fats: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    carbohydrates: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    calories: {
      type: DataTypes.INTEGER,
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
  await queryInterface.dropTable('ingredients');
};