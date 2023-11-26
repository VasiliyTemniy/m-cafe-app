import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes, QueryTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('order_foods', {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'orders', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'foods', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    archive_food_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    archive_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    archive_food_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'order_foods_pkey'",
    { type: QueryTypes.SELECT }
  );

  // Not using food_id for primary key because it can be null if admin decides to delete food; use archive_food_id instead
  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('order_foods', {
      fields: [
        'order_id', 'archive_food_id'
      ],
      type: 'primary key',
      name: 'order_foods_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('order_foods');
};