import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { CoverageEntityType, CoverageParentType } from '@m-cafe-app/shared-constants';
import { Model, DataTypes } from 'sequelize';


export class Coverage extends Model<InferAttributes<Coverage>, InferCreationAttributes<Coverage>> {
  declare parentId: number;
  declare parentType: CoverageParentType;
  declare entityType: CoverageEntityType;
  declare entityId: number;
}


export const initCoverageModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Coverage.init({
        parentId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false
        },
        parentType: {
          type: DataTypes.SMALLINT,
          primaryKey: true,
          allowNull: false,
          // validate: {
          //   isIn: [Object.values(CoverageParentType)]
          // }
        },
        entityType: {
          type: DataTypes.SMALLINT,
          primaryKey: true,
          allowNull: false,
          // validate: {
          //   isIn: [Object.values(CoverageEntityType)]
          // }
        },
        entityId: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          defaultValue: 0 // 0 if entity_type === 'all'; in this case, entity_id is not checked
        },
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'coverage',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};