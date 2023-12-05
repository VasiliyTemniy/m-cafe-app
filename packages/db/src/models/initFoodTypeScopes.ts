import { Food } from './Food.js';
import { FoodType } from './FoodType.js';
import { includeDescriptionLoc, includeNameLoc } from './commonIncludes.js';



export const initFoodTypeScopes = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      FoodType.addScope('all', {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [ includeNameLoc, includeDescriptionLoc ]
      });

      FoodType.addScope('allWithTimestamps', {
        include: [ includeNameLoc, includeDescriptionLoc ]
      });

      FoodType.addScope('withFoods', {
        include: [{
          model: Food,
          as: 'foods',
          attributes: {
            exclude: ['nameLocId', 'descriptionLocId', 'foodTypeId', 'price', 'createdAt', 'updatedAt']
          }
        }]
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};