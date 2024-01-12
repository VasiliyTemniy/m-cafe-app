import { isCurrencyCode } from '@m-cafe-app/shared-constants';
import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes, QueryTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('currency_conversions', {
    source_currency_code: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isCurrencyCodeValidator(value: unknown) {
          if (!isCurrencyCode(value)) {
            throw new Error(`Invalid currency code: ${value}`);
          }
        }
      }
    },
    target_currency_code: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isCurrencyCodeValidator(value: unknown) {
          if (!isCurrencyCode(value)) {
            throw new Error(`Invalid currency code: ${value}`);
          }
        }
      }
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
        'source_currency_code', 'target_currency_code'
      ],
      type: 'primary key',
      name: 'currency_conversions_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('currency_conversions');
};