import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes, Op } from 'sequelize';
import { allowedThemes, componentGroups } from '@m-cafe-app/shared-constants';
import { Organization } from './Organization.js';
import { User } from './User.js';


export class UiSetting extends Model<InferAttributes<UiSetting>, InferCreationAttributes<UiSetting>> {
  declare id: CreationOptional<number>;
  declare organizationId: ForeignKey<Organization['id']> | null;
  declare updatedBy: ForeignKey<User['id']>;
  declare name: string;
  declare group: string;
  declare theme: string;
  declare value: string;
  declare organization?: NonAttribute<Organization>;
  declare updatedByAuthor?: NonAttribute<User>;
}


export const initUiSettingModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      UiSetting.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        organizationId: {
          type: DataTypes.INTEGER,
          allowNull: true, // if null, it means it is a global ui setting
          references: { model: 'organizations', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          unique: 'unique_ui_setting'
        },
        updatedBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: 'unique_ui_setting'
        },
        group: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [componentGroups]
          },
          unique: 'unique_ui_setting'
        },
        theme: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [allowedThemes]
          },
          unique: 'unique_ui_setting'
        },
        value: {
          type: DataTypes.STRING,
          allowNull: false
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'ui_setting',
        indexes: [
          {
            unique: true,
            fields: ['name', 'group', 'theme', 'organization_id']
          }
        ],
        defaultScope: {
          where: {
            value: {
              [Op.ne]: 'false'
            }
          }
        },
        scopes: {
          light: {
            where: {
              theme: {
                [Op.eq]: 'light'
              },
              value: {
                [Op.ne]: 'false'
              }
            }
          },
          dark: {
            where: {
              theme: {
                [Op.eq]: 'dark'
              },
              value: {
                [Op.ne]: 'false'
              }
            }
          },
          nonFalsy: {
            where: {
              value: {
                [Op.ne]: 'false'
              }
            }
          },
          all: {},
          raw: {}
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initUiSettingAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      UiSetting.belongsTo(Organization, {
        targetKey: 'id',
        foreignKey: 'organizationId',
        as: 'organization',
      });

      UiSetting.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByAuthor',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};