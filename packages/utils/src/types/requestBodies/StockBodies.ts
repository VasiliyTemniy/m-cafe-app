import type { MapToUnknown } from "../helpers.js";
import type { StockDT } from "../../models/Stock.js";
import { hasOwnProperty } from "../helpers.js";
import { isNumber } from "../typeParsers.js";


export type EditStock = Omit<StockDT, 'ingredientId' | 'facilityId' | 'ingredient'>
& {
  ingredientId: number;
};

export type NewStock = Omit<EditStock, 'id'>;

  
type EditStockFields = MapToUnknown<EditStock>;

type NewStockFields = MapToUnknown<NewStock>;

export type EditStockBody = {
  stocksUpdate: Array<EditStock | NewStock>;
};
  

const hasNewStockFields = (obj: unknown): obj is NewStockFields =>
  hasOwnProperty(obj, 'amount')
  &&
  hasOwnProperty(obj, 'ingredientId');

const hasEditStockFields = (obj: unknown): obj is EditStockFields =>
  hasOwnProperty(obj, 'id')
  &&
  hasOwnProperty(obj, 'amount')
  &&
  hasOwnProperty(obj, 'ingredientId');


const hasEditStockBodyFields = (body: unknown): body is { stocksUpdate: unknown } =>
  hasOwnProperty(body, 'stocksUpdate');
  
export const isEditStockBody = (body: unknown): body is EditStockBody => {
  if (!hasEditStockBodyFields(body)) return false;

  if (!Array.isArray(body.stocksUpdate)) return false;

  for (const obj of body.stocksUpdate) {

    if (hasEditStockFields(obj)) if (
      isNumber(obj.id)
      &&
      isNumber(obj.amount)
      &&
      isNumber(obj.ingredientId)
    ) continue;

    if (hasNewStockFields(obj)) if (
      isNumber(obj.amount)
      &&
      isNumber(obj.ingredientId)
    ) continue;

    return false;
  }

  return true;
};