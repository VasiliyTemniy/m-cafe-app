import type { MigrationContext } from '../types/Migrations.js';
import { isDynamicModulePageType } from '@m-cafe-app/shared-constants';
import { DataTypes, QueryTypes } from 'sequelize';

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
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isDynamicModulePageTypeValidator(value: unknown) {
          if (!isDynamicModulePageType(value)) {
            throw new Error(`Invalid dynamic module page type: ${value}`);
          }
        }
      },
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