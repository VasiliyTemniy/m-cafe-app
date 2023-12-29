import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes, QueryTypes } from 'sequelize';

/**
 * This table fixates each enum key-value pairs to prevent enum values from being messed up after some app updates/fixes
 * On each server start, cycle through all the enums, getByPk({ name: enumName, key: enumKey }), check if the value is still valid,
 * add new key-value pair if it's not there
 */

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('fixed_enums', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  });

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'fixed_enums_pkey'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('fixed_enums', {
      fields: [
        'name', 'key'
      ],
      type: 'primary key',
      name: 'fixed_enums_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('fixed_enums');
};