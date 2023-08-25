import type { OrderFoodData } from "@m-cafe-app/db";
import { isNumber, isString } from "../types/typeParsers.js";
import { hasOwnProperty, MapToDT, MapToUnknown } from "../types/helpers.js";
import { FoodDTS, isFoodDTS } from "./Food.js";


export type OrderFoodDT = Omit<MapToDT<OrderFoodData>, 'foodId' | 'orderId'>
& {
  food?: FoodDTS;
};

type OrderFoodDTFields = MapToUnknown<OrderFoodDT>;

const hasOrderFoodDTFields = (obj: unknown): obj is OrderFoodDTFields =>
  hasOwnProperty(obj, "id")
  &&
  hasOwnProperty(obj, "amount")
  &&
  hasOwnProperty(obj, "archivePrice")
  &&
  hasOwnProperty(obj, "archiveFoodName");

export const isOrderFoodDT = (obj: unknown): obj is OrderFoodDT => {
  if (!hasOrderFoodDTFields(obj)) return false;

  if (
    hasOwnProperty(obj, "food") && !isFoodDTS(obj.food)
  ) return false;
  
  return isNumber(obj.id)
  &&
  isNumber(obj.amount)
  &&
  isNumber(obj.archivePrice)
  &&
  isString(obj.archiveFoodName);
};