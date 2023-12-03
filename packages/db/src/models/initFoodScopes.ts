import { Food } from './Food.js';
import { includeDescriptionLoc, includeFoodComponents, includeNameLoc } from './commonIncludes.js';



export const initFoodScopes = async () => {
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
        include: includeFoodComponents
      });

      // add scopes for composite / non-composite food?

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};