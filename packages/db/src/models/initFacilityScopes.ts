import { Facility } from './Facility.js';
import { Ingredient } from './Ingredient.js';
import { Stock } from './Stock.js';
import { User } from './User.js';
import {
  includeAddress,
  includeNameLoc,
  includeDescriptionLoc,
  includeNestedNameLoc,
  includeStockMeasureLoc
} from './commonIncludes.js';



export const initFacilityScopes = async () => {

  const includeStocks = {
    model: Stock,
    as: 'stocks',
    required: false,
    include: [
      {
        model: Ingredient,
        as: 'ingredient',
        include: [
          includeNestedNameLoc,
          includeStockMeasureLoc
        ]
      }
    ] 
  };

  const includeManagers = {
    model: User,
    as: 'managers',
    required: false,
    attributes: {
      exclude: ['passwordHash', 'createdAt', 'updatedAt', 'deletedAt']
    },
  };

  return new Promise<void>((resolve, reject) => {
    try {

      Facility.addScope('all', {
        include: includeAddress,
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      });

      Facility.addScope('allWithTimestamps', {
        include: includeAddress,
      });

      Facility.addScope('allWithStocks', {
        include: [
          includeAddress,
          includeNameLoc,
          includeDescriptionLoc,
          includeStocks
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      });

      Facility.addScope('allWithManagers', {
        include: [
          includeAddress,
          includeNameLoc,
          includeDescriptionLoc,
          includeManagers
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      });

      Facility.addScope('allWithFullData', {
        include: [
          includeAddress,
          includeNameLoc,
          includeDescriptionLoc,
          includeManagers,
          includeStocks
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};