import { Facility } from './Facility.js';
import { Food } from './Food.js';
import { Order } from './Order.js';
import { OrderFood } from './OrderFood.js';
import { includeDescriptionLoc, includeNameLoc, includeNestedNameLoc } from './commonIncludes.js';


export const initOrderScopes = async () => {

  const includeOrderFoods = {
    model: OrderFood,
    as: 'orderFoods',
    include: [
      {
        model: Food,
        as: 'food',
        attributes: {
          exclude: ['nameLocId', 'descriptionLocId', 'foodTypeId', 'price', 'createdAt', 'updatedAt']
        },
        include: [includeNestedNameLoc]
      }
    ]
  };

  const includeFacilitySimple = {
    model: Facility,
    as: 'facility',
    attributes: {
      exclude: ['nameLocId', 'descriptionLocId', 'addressId', 'managerId', 'createdAt', 'updatedAt']
    },
    include: [includeNameLoc, includeDescriptionLoc]
  };

  return new Promise<void>((resolve, reject) => {
    try {

      Order.addScope('all', {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
      });

      Order.addScope('allWithFullData', {
        include: [
          includeOrderFoods,
          includeFacilitySimple
        ],
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
      });

      Order.addScope('allWithTimestamps', {
        include: [
          includeOrderFoods,
          includeFacilitySimple
        ]
      });


      resolve();
    } catch (err) {
      reject(err);
    }
  });
};