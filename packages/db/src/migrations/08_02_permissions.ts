import type { MigrationContext } from '../types/Migrations.js';
import { isPermissionAccess, isPermissionAction, isPermissionTarget } from '@m-cafe-app/shared-constants';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('permissions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    target: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isPermissionTargetValidator(value: unknown) {
          if (!isPermissionTarget(value)) {
            throw new Error(`Invalid permission target: ${value}`);
          }
        }
      },
    },
    // if PermissionAccess === 'byCoverage' then access is referenced from coverages
    access: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isPermissionAccessValidator(value: unknown) {
          if (!isPermissionAccess(value)) {
            throw new Error(`Invalid permission access: ${value}`);
          }
        }
      },
    },
    action: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: {
        isPermissionActionValidator(value: unknown) {
          if (!isPermissionAction(value)) {
            throw new Error(`Invalid permission action: ${value}`);
          }
        }
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    starts_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ends_at: {
      type: DataTypes.DATE,
      allowNull: true
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
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('permissions');
};