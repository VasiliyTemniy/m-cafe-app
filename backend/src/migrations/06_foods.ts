import { DataTypes } from 'sequelize';
import { MigrationContext } from '../types/MigrationContext.js';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('foods', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name_loc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'loc_strings', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    food_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'food_types', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    description_loc_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'loc_strings', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
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
  await queryInterface.dropTable('foods');
};