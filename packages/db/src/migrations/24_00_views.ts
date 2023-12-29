import type { MigrationContext } from '../types/Migrations.js';
import { ViewParentType } from '@m-cafe-app/shared-constants';
import { DataTypes, QueryTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('views', {
    user_ip: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(ViewParentType)],
      }
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'views_pkey'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('views', {
      fields: [
        'user_ip', 'parent_id', 'parent_type'
      ],
      type: 'primary key',
      name: 'views_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('views');
};