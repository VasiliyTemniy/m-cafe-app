import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes, QueryTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('role_permissions', {
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'roles', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'permissions', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    }
  });

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'role_permissions_pkey'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('role_permissions', {
      fields: [
        'role_id', 'permission_id'
      ],
      type: 'primary key',
      name: 'role_permissions_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('role_permissions');
};