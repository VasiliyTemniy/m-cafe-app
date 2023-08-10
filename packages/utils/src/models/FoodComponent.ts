import { FoodComponentData } from "@m-cafe-app/db-models";
import { isNumber, isBoolean } from "../types/typeParsers.js";
import { hasOwnProperty, MapToDT, MapToUnknown } from "../types/helpers.js";
import { IngredientDTS, isIngredientDTS } from "./Ingredient.js";
import { FoodDTS, isFoodDTS } from "./Food.js";


export type FoodComponentDT = Omit<MapToDT<FoodComponentData>, 'foodId' | 'componentId'>
& {
  component: FoodDTS | IngredientDTS;
};

type FoodComponentDTFields = MapToUnknown<FoodComponentDT>;

const hasFoodComponentDTFields = (obj: unknown): obj is FoodComponentDTFields =>
  hasOwnProperty(obj, "id")
  &&
  hasOwnProperty(obj, "component")
  &&
  hasOwnProperty(obj, "amount")
  &&
  hasOwnProperty(obj, "compositeFood");

// DTS means DataTransitSimple, used to bring only necessary data to nested objects
export const isFoodComponentDT = (obj: unknown): obj is FoodComponentDT =>
  hasFoodComponentDTFields(obj)
  &&
  isNumber(obj.id)
  &&
  (isFoodDTS(obj.component) || isIngredientDTS(obj.component))
  &&
  isNumber(obj.amount)
  &&
  isBoolean(obj.compositeFood);