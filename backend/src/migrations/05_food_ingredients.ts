import { DataTypes } from 'sequelize';
import { MigrationContext } from '../types/umzugContext.js';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('food_ingredients', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'foods', key: 'id' }
    },
    ingredient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'ingredients', key: 'id' }
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('food_ingredients');
};