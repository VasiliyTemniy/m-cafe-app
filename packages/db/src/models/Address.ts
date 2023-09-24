import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import type { PropertiesCreationOptional } from '../types/helpers.js';
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../db.js';
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
} from '@m-cafe-app/shared-constants';


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
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export type AddressData = Omit<InferAttributes<Address>, PropertiesCreationOptional>
  & { id: number; };


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
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'address',
  indexes: [
    {
      unique: true,
      fields: ['region', 'region_district', 'city', 'city_district', 'street', 'house', 'entrance', 'floor', 'flat', 'entrance_key']
    }
  ]
});
  
export default Address;