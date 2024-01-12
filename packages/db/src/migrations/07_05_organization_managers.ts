import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes, QueryTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('organization_managers', {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'organizations', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  });

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'organization_managers_pkey'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('organization_managers', {
      fields: [
        'user_id', 'organization_id'
      ],
      type: 'primary key',
      name: 'organization_managers_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('organization_managers');
};