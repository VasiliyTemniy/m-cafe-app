import { StockData } from "@m-cafe-app/db-models";
import { isNumber } from "../types/typeParsers.js";
import { hasOwnProperty, MapToDT, MapToUnknown } from "../types/helpers.js";
import { IngredientDT, isIngredientDT } from "./Ingredient.js";


export type StockDT = Omit<MapToDT<StockData>, 'ingredientId' | 'facilityId'>
& {
  ingredient?: IngredientDT;
  ingredientId?: number;
  facilityId?: number;
};

type StockDTFields = MapToUnknown<StockDT>;

const hasStockDTFields = (obj: unknown): obj is StockDTFields =>
  hasOwnProperty(obj, "id")
  &&
  hasOwnProperty(obj, "amount");

export const isStockDT = (obj: unknown): obj is StockDT => {
  if (!hasStockDTFields(obj)) return false;

  if (
    (hasOwnProperty(obj, "ingredient") && !isIngredientDT(obj.ingredient))
    ||
    (hasOwnProperty(obj, "ingredientId") && !isNumber(obj.ingredientId))
    ||
    (hasOwnProperty(obj, "facilityId") && !isNumber(obj.facilityId))
  ) return false;

  return isNumber(obj.id) && isNumber(obj.amount);
};