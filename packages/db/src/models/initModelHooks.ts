import {Food} from './Food.js';
import { FoodComponent } from './FoodComponent.js';


export const initModelHooks = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      Food.addHook('afterFind', findResult => {
        if (!findResult) return;
      
        const mapComponentKey = (instance: FoodComponent) => {
          if (instance.compositeFood && instance.food !== undefined) {
            instance.component = instance.food;
          } else if (!instance.compositeFood && instance.ingredient !== undefined) {
            instance.component = instance.ingredient;
          }
          delete instance.food;
          delete instance.ingredient;
        };
      
        const mapFoodComponents = (instance: Food) => {
          if (instance.foodComponents && instance.foodComponents !== undefined) {
            for (const foodComponent of instance.foodComponents) {
              mapComponentKey(foodComponent);
            }
            return;
          }
        };
      
        if (!Array.isArray(findResult)) {
          mapFoodComponents(findResult as Food);
          return;
        }
      
        for (const instance of findResult as Food[]) {
          mapFoodComponents(instance);
        }
      });


      FoodComponent.addHook('afterFind', findResult => {
        if (!findResult) return;
      
        const mapComponentKey = (instance: FoodComponent) => {
          if (instance.compositeFood && instance.food !== undefined) {
            instance.component = instance.food;
          } else if (!instance.compositeFood && instance.ingredient !== undefined) {
            instance.component = instance.ingredient;
          }
          delete instance.food;
          delete instance.ingredient;
        };
      
        if (!Array.isArray(findResult)) {
          mapComponentKey(findResult as FoodComponent);
          return;
        }
      
        for (const instance of findResult as FoodComponent[]) {
          mapComponentKey(instance);
        }
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};