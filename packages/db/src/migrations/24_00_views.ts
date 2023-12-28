import type { MigrationContext } from '../types/Migrations.js';
import { ViewEntityType } from '@m-cafe-app/shared-constants';
import { DataTypes, QueryTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('views', {
    user_ip: {
      type: DataTypes.STRING,
      allowNull: false
    },
    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    entity_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(ViewEntityType)],
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
        'user_ip', 'entity_id', 'entity_type'
      ],
      type: 'primary key',
      name: 'views_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('views');
};