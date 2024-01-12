import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes, QueryTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('promo_event_code_usages', {
    promo_code_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'promo_event_codes', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'promo_event_code_usages_pkey'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('promo_event_code_usages', {
      fields: [
        'promo_code_id', 'user_id'
      ],
      type: 'primary key',
      name: 'promo_event_code_usages_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('promo_event_code_usages');
};