import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  Sequelize
} from 'sequelize';
import { Model, DataTypes, Op } from 'sequelize';
import { FixedLocScope, LocParentType, LocType } from '@m-cafe-app/shared-constants';
import { Loc } from './Loc.js';


export class FixedLoc extends Model<InferAttributes<FixedLoc>, InferCreationAttributes<FixedLoc>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare namespace: string;
  declare scope: string;
  declare locs?: NonAttribute<Loc>[];
}


export const initFixedLocModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      FixedLoc.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: 'unique_fixed_loc'
        },
        namespace: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: 'unique_fixed_loc'
        },
        scope: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            isIn: [Object.values(FixedLocScope)]
          },
          unique: 'unique_fixed_loc'
        }
        // actual locs are referenced from locs table
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'fixed_loc',
        indexes: [
          {
            unique: true,
            fields: ['name', 'namespace', 'scope']
          }
        ],
        defaultScope: {
          where: {
            scope: {
              [Op.or]: [
                'shared',
                'customer',
              ]
            }
          },
          attributes: {
            exclude: ['scope']
          }
        },
        scopes: {
          customer: {
            where: {
              scope: {
                [Op.or]: [
                  'shared',
                  'customer',
                ]
              }
            },
            attributes: {
              exclude: ['scope']
            }
          },
          admin: {
            where: {},
          },
          manager: {
            where: {
              scope: {
                [Op.ne]: 'admin'
              }
            },
            attributes: {
              exclude: ['scope']
            }
          },
          raw: {
            where: {}
          },
          all: {
            where: {},
          }
        }
      });
      
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initFixedLocAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      FixedLoc.hasMany(Loc, {
        foreignKey: 'parentId',
        as: 'locs',
        scope: {
          parentType: LocParentType.FixedLoc,
          locType: LocType.Text
        },
        constraints: false,
        foreignKeyConstraint: false
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};