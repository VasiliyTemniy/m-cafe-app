import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes, QueryTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('currency_conversions', {
    source_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'currencies', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    target_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'currencies', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    rate: {
      type: DataTypes.DOUBLE,
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

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'currency_conversions_pkey'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('currency_conversions', {
      fields: [
        'source_id', 'target_id'
      ],
      type: 'primary key',
      name: 'currency_conversions_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('currency_conversions');
};