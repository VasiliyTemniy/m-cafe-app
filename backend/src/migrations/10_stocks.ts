import { DataTypes } from 'sequelize';
import { MigrationContext } from '../types/umzugContext.js';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('stocks', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ingredient_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'ingredients', key: 'id' }
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'facilities', key: 'id' }
    },
    amount: {
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
  await queryInterface.dropTable('stocks');
};