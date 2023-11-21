import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import type { PropertiesCreationOptional } from '@m-cafe-app/shared-constants';
import type { Sequelize } from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { LocString } from './LocString.js';
import { Op } from 'sequelize';
import { fixedLocFilter, fixedLocsScopes } from '@m-cafe-app/shared-constants';


export class FixedLoc extends Model<InferAttributes<FixedLoc>, InferCreationAttributes<FixedLoc>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare namespace: string;
  declare scope: string;
  declare locStringId: ForeignKey<LocString['id']>;
  declare locString?: NonAttribute<LocString>;
}


export type FixedLocData = Omit<InferAttributes<FixedLoc>, PropertiesCreationOptional>
  & { id: number; };


export const initFixedLocModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {

      const includeLocString = {
        model: LocString,
        as: 'locString',
        where: {
          mainStr: {
            [Op.ne]: fixedLocFilter
          }
        }
      };

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
            isIn: [fixedLocsScopes]
          },
          unique: 'unique_fixed_loc'
        },
        locStringId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'loc_strings', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        }
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
          include: includeLocString,
          attributes: {
            exclude: ['scope', 'locStringId']
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
            include: includeLocString,
            attributes: {
              exclude: ['scope', 'locStringId']
            }
          },
          admin: {
            where: {},
            include: {
              ...includeLocString,
              // do not exclude filtered fixed locs for admin:
              where: {}
            }
          },
          manager: {
            where: {
              scope: {
                [Op.ne]: 'admin'
              }
            },
            include: includeLocString,
            attributes: {
              exclude: ['scope', 'locStringId']
            }
          },
          raw: {
            where: {}
          },
          all: {
            where: {},
            include: includeLocString
          }
        }
      });
      
      resolve();
    } catch (err) {
      reject(err);
    }
  });
};