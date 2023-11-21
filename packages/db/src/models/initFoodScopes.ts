import { Food } from './Food.js';
import { FoodComponent } from './FoodComponent.js';
import { includeDescriptionLoc, includeFoodComponentData, includeNameLoc } from './commonIncludes.js';



export const initFoodScopes = async () => {

  const includeComponents = {
    model: FoodComponent,
    as: 'components',
    include: includeFoodComponentData,
    attributes: {
      exclude: ['createdAt', 'updatedAt']
    }
  };

  return new Promise<void>((resolve, reject) => {
    try {

      Food.addScope('all', {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: [ includeNameLoc, includeDescriptionLoc ]
      });

      Food.addScope('allWithTimestamps', {
      });

      Food.addScope('allWithComponents', {
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: includeComponents
      });

      // add scopes for composite / non-composite food?

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};