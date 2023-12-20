import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes, QueryTypes } from 'sequelize';
import { DynamicModulePageType } from '@m-cafe-app/shared-constants';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('dynamic_module_pages', {
    dynamic_module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'dynamic_modules', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    page_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [Object.values(DynamicModulePageType)]
      }
    }
  });

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'dynamic_module_pages_pkey'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('dynamic_module_pages', {
      fields: [
        'dynamic_module_id', 'page_type'
      ],
      type: 'primary key',
      name: 'dynamic_module_pages_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('dynamic_module_pages');
};