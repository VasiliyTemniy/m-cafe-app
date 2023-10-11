import type { MigrationContext } from '../types/Migrations.js';
import { DataTypes } from 'sequelize';
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

export const up = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.createTable('addresses', {
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
    region_district: {
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
    city_district: {
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
    entrance_key: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: [entranceKeyRegExp, 'i'],
        len: [minEntranceKeyLen, maxEntranceKeyLen]
      },
      unique: 'unique_address'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    uniqueKeys: {
      unique_address: {
        customIndex: true,
        fields: ['region', 'region_district', 'city', 'city_district', 'street', 'house', 'entrance', 'floor', 'flat', 'entrance_key']
      }
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('addresses');
};