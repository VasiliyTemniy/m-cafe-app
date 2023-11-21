import type { InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import type { PropertiesCreationOptional } from '@m-cafe-app/shared-constants';
import type { Sequelize } from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { Address } from './Address.js';
import { LocString } from './LocString.js';
import { Stock } from './Stock.js';
import { User } from './User.js';
import { includeAddress, includeNameLoc, includeDescriptionLoc } from './commonIncludes.js';


export class Facility extends Model<InferAttributes<Facility>, InferCreationAttributes<Facility>> {
  declare id: CreationOptional<number>;
  declare addressId: ForeignKey<Address['id']>;
  declare nameLocId: ForeignKey<LocString['id']>;
  declare descriptionLocId: ForeignKey<LocString['id']>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare address?: NonAttribute<Address>;  
  declare nameLoc?: NonAttribute<LocString>;
  declare descriptionLoc?: NonAttribute<LocString>;
  declare managers?: NonAttribute<User[]>;
  declare stocks?: NonAttribute<Stock[]>;
}


export type FacilityData = Omit<InferAttributes<Facility>, PropertiesCreationOptional>
  & { id: number; };


export const initFacilityModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Facility.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        addressId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'addresses', key: 'id' },
        },
        nameLocId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'loc_strings', key: 'id' }
        },
        descriptionLocId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'loc_strings', key: 'id' }
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: true,
        modelName: 'facility',
        defaultScope: {
          include: [
            includeAddress,
            includeNameLoc,
            includeDescriptionLoc
          ],
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
        // See initFacilityScopes.ts for more
        scopes: {
          raw: {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          }
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};