import { DataTypes } from 'sequelize';
import { MigrationContext } from '../types/umzugContext.js';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('order_foods', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'orders', key: 'id' }
    },
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'foods', key: 'id' }
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    archive_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('order_foods');
};