import type { MigrationContext } from '../types/MigrationContext.js';
import { DataTypes, QueryTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('facility_managers', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    facility_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'facilities', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  });

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'facility_managers_pkey'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('facility_managers', {
      fields: [
        'user_id', 'facility_id'
      ],
      type: 'primary key',
      name: 'facility_managers_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('facility_managers');
};