import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import {
  cityRegExp,
  districtRegExp,
  entranceKeyRegExp,
  entranceRegExp,
  flatRegExp,
  houseRegExp,
  maxCityLen,
  maxDistrictLen,
  maxEntranceKeyLen,
  maxEntranceLen,
  maxFlatLen,
  maxFloorLen,
  maxHouseLen,
  maxRegionLen,
  maxStreetLen,
  minCityLen,
  minDistrictLen,
  minEntranceKeyLen,
  minEntranceLen,
  minFlatLen,
  minFloorLen,
  minHouseLen,
  minRegionLen,
  minStreetLen,
  regionRegExp,
  streetRegExp
} from '@m-market-app/shared-constants';
import { User } from './User.js';
import { UserAddress } from './UserAddress.js';
import { Facility } from './Facility.js';
import { Order } from './Order.js';


export class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>> {
  declare id: CreationOptional<number>;
  declare region?: string;
  declare regionDistrict?: string;
  declare city: string;
  declare cityDistrict?: string;
  declare street: string;
  declare house?: string;
  declare entrance?: string;
  declare floor?: number;
  declare flat?: string;
  declare entranceKey?: string;
  declare postalCode?: string;
  declare users?: NonAttribute<User[]>;
  declare facilities?: NonAttribute<Facility[]>;
  declare orders?: NonAttribute<Order[]>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const initAddressModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      Address.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        region: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            is: [regionRegExp, 'i'],
            len: [minRegionLen, maxRegionLen]
          },
          unique: 'unique_address'
        },
        regionDistrict: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            is: [districtRegExp, 'i'],
            len: [minDistrictLen, maxDistrictLen]
          },
          unique: 'unique_address'
        },
        city: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            is: [cityRegExp, 'i'],
            len: [minCityLen, maxCityLen]
          },
          unique: 'unique_address'
        },
        cityDistrict: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            is: [districtRegExp, 'i'],
            len: [minDistrictLen, maxDistrictLen]
          },
          unique: 'unique_address'
        },
        street: {
          type: DataTypes.STRING,
          allowNull: false,
          validate: {
            is: [streetRegExp, 'i'],
            len: [minStreetLen, maxStreetLen]
          },
          unique: 'unique_address'
        },
        house: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            is: [houseRegExp, 'i'],
            len: [minHouseLen, maxHouseLen]
          },
          unique: 'unique_address'
        },
        entrance: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            is: [entranceRegExp, 'i'],
            len: [minEntranceLen, maxEntranceLen]
          },
          unique: 'unique_address'
        },
        floor: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            isNumeric: true,
            len: [minFloorLen, maxFloorLen]
          },
          unique: 'unique_address'
        },
        flat: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            is: [flatRegExp, 'i'],
            len: [minFlatLen, maxFlatLen]
          },
          unique: 'unique_address'
        },
        entranceKey: {
          type: DataTypes.STRING,
          allowNull: true,
          validate: {
            is: [entranceKeyRegExp, 'i'],
            len: [minEntranceKeyLen, maxEntranceKeyLen]
          },
          unique: 'unique_address'
        },
        postalCode: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: 'unique_address'
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
        modelName: 'address',
        indexes: [
          {
            unique: true,
            fields: ['region', 'region_district', 'city', 'city_district', 'street', 'house', 'entrance', 'floor', 'flat', 'entrance_key', 'postal_code']
          }
        ],
        defaultScope: {
          attributes: {
            exclude: ['createdAt', 'updatedAt']
          }
        },
        scopes: {
          all: {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          },
          raw: {
            attributes: {
              exclude: ['createdAt', 'updatedAt']
            }
          },
          allWithTimestamps: {}
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initAddressAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Address.belongsToMany(User, {
        through: UserAddress,
        foreignKey: 'addressId',
        otherKey: 'userId',
        as: 'users'
      });

      // Through table associations: uncomment if needed
      // Address.hasMany(UserAddress, {
      //   foreignKey: 'addressId',
      //   as: 'addressUser'
      // });
      // UserAddress.belongsTo(Address, {
      //   foreignKey: 'addressId',
      //   targetKey: 'id'
      // });

      Address.hasMany(Facility, {
        foreignKey: 'addressId',
        as: 'facilities'
      });

      Address.hasMany(Order, {
        foreignKey: 'addressId',
        as: 'orders'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};