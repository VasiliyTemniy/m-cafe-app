import { DataTypes } from 'sequelize';

import { sequelize } from '../utils/db.js';
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
} from '../utils/constants.js';
import { Address } from '@m-cafe-app/utils';

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
    }
  },
  district: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: [districtRegExp, 'i'],
      len: [minDistrictLen, maxDistrictLen]
    }
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: [cityRegExp, 'i'],
      len: [minCityLen, maxCityLen]
    }
  },
  street: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: [streetRegExp, 'i'],
      len: [minStreetLen, maxStreetLen]
    }
  },
  house: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: [houseRegExp, 'i'],
      len: [minHouseLen, maxHouseLen]
    }
  },
  entrance: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: [entranceRegExp, 'i'],
      len: [minEntranceLen, maxEntranceLen]
    }
  },
  floor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isNumeric: true,
      len: [minFloorLen, maxFloorLen]
    }
  },
  flat: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: [flatRegExp, 'i'],
      len: [minFlatLen, maxFlatLen]
    }
  },
  entranceKey: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: [entranceKeyRegExp, 'i'],
      len: [minEntranceKeyLen, maxEntranceKeyLen]
    }
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
  modelName: 'address'
});

export default Address;