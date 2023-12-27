import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { DynamicModulePageType } from '@m-cafe-app/shared-constants';
import { Model, DataTypes } from 'sequelize';
import { DynamicModule } from './DynamicModule.js';


export class DynamicModulePage extends Model<InferAttributes<DynamicModulePage>, InferCreationAttributes<DynamicModulePage>> {
  declare dynamicModuleId: ForeignKey<DynamicModule['id']>;
  declare pageType: DynamicModulePageType;
  declare dynamicModule?: NonAttribute<DynamicModule>;
}


export const initDynamicModulePageModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      DynamicModulePage.init({
        dynamicModuleId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: { model: 'dynamic_modules', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        pageType: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true,
          validate: {
            isIn: [Object.values(DynamicModulePageType)]
          }
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'dynamic_module_page'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initDynamicModulePageAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      DynamicModulePage.belongsTo(DynamicModule, {
        targetKey: 'id',
        foreignKey: 'dynamicModuleId',
        as: 'dynamicModule'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};