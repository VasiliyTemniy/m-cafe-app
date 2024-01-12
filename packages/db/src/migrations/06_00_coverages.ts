import type { MigrationContext } from '../types/Migrations.js';
import { isCoverageEntityType, isCoverageParentType } from '@m-market-app/shared-constants';
import { DataTypes, QueryTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('coverages', {
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    parent_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isCoverageParentTypeValidator(value: unknown) {
          if (!isCoverageParentType(value)) {
            throw new Error(`Invalid coverage parent type: ${value}`);
          }
        }
      },
    },
    entity_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isCoverageEntityTypeValidator(value: unknown) {
          if (!isCoverageEntityType(value)) {
            throw new Error(`Invalid coverage entity type: ${value}`);
          }
        }
      },
    },
    entity_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0 // 0 if entity_type === 'all'; in this case, entity_id is not checked
    },
  });

  const constraintCheck = await queryInterface.sequelize.query(
    "SELECT * FROM pg_constraint WHERE conname = 'coverages_pkey'",
    { type: QueryTypes.SELECT }
  );

  if (!constraintCheck[0]) {
    await queryInterface.addConstraint('coverages', {
      fields: [
        'parent_id', 'parent_type', 'entity_type', 'entity_id'
      ],
      type: 'primary key',
      name: 'coverages_pkey'
    });
  }
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('coverages');
};