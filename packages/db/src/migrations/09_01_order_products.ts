import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes, QueryTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('order_products', {
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'orders', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'products', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    archive_product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    archive_product_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    archive_product_name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'order_products_pkey'",
    { type: QueryTypes.SELECT }
  );

  // Not using product_id for primary key because it can be null if admin decides to delete product; use archive_product_id instead
  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('order_products', {
      fields: [
        'order_id', 'archive_product_id'
      ],
      type: 'primary key',
      name: 'order_products_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('order_products');
};