import type { MapToUnknown, MapToDT } from "../types/helpers.js";
import type { IngredientData } from "@m-cafe-app/db";
import type { LocStringDT } from "./LocString.js";
import { isNumber } from "../types/typeParsers.js";
import { hasOwnProperty } from "../types/helpers.js";
import { isLocStringDT } from "./LocString.js";


export type IngredientDT = Omit<MapToDT<IngredientData>, 'nameLocId' | 'stockMeasureLocId'>
& {
  nameLoc: LocStringDT;
  stockMeasureLoc: LocStringDT;
};

type IngredientDTFields = MapToUnknown<IngredientDT>;

const hasIngredientDTFields = (obj: unknown): obj is IngredientDTFields =>
  hasOwnProperty(obj, "id")
  &&
  hasOwnProperty(obj, "nameLoc")
  &&
  hasOwnProperty(obj, "stockMeasureLoc");

export const isIngredientDT = (obj: unknown): obj is IngredientDT => {
  if (!hasIngredientDTFields(obj)) return false;

  if (
    (hasOwnProperty(obj, "proteins") && !isNumber(obj.proteins))
    ||
    (hasOwnProperty(obj, "fats") && !isNumber(obj.fats))
    ||
    (hasOwnProperty(obj, "carbohydrates") && !isNumber(obj.carbohydrates))
    ||
    (hasOwnProperty(obj, "calories") && !isNumber(obj.calories))
  ) return false;

  return isNumber(obj.id) && isLocStringDT(obj.nameLoc) && isLocStringDT(obj.stockMeasureLoc);
};


export type IngredientDTS = Omit<MapToDT<IngredientData>, 'nameLocId' | 'stockMeasureLocId'>
& {
  nameLoc: LocStringDT;
};

type IngredientDTSFields = MapToUnknown<IngredientDTS>;

const hasIngredientDTSFields = (obj: unknown): obj is IngredientDTSFields =>
  hasOwnProperty(obj, "id")
  &&
  hasOwnProperty(obj, "nameLoc");

export const isIngredientDTS = (obj: unknown): obj is IngredientDTS => {
  if (!hasIngredientDTSFields(obj)) return false;

  if (
    (hasOwnProperty(obj, "proteins") && !isNumber(obj.proteins))
    ||
    (hasOwnProperty(obj, "fats") && !isNumber(obj.fats))
    ||
    (hasOwnProperty(obj, "carbohydrates") && !isNumber(obj.carbohydrates))
    ||
    (hasOwnProperty(obj, "calories") && !isNumber(obj.calories))
  ) return false;

  return isNumber(obj.id) && isLocStringDT(obj.nameLoc);
};