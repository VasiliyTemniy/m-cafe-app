import { IngredientDT } from "../../models/Ingredient.js";
import { hasOwnProperty, MapToUnknown } from "../helpers.js";
import { EditLocString, isEditLocString, isNewLocString, NewLocString } from "../../models/LocString.js";
import { isNumber } from "../typeParsers.js";

export type NewIngredientBody = Omit<IngredientDT, 'id' | 'nameLoc' | 'stockMeasureLoc'>
& {
  nameLoc: NewLocString;
  stockMeasureLoc: NewLocString;
};

type NewIngredientBodyFields = MapToUnknown<NewIngredientBody>;

const hasNewIngredientBodyFields = (body: unknown): body is NewIngredientBodyFields =>
  hasOwnProperty(body, 'nameLoc') && hasOwnProperty(body, 'stockMeasureLoc');

export const isNewIngredientBody = (body: unknown): body is NewIngredientBody => {
  if (!hasNewIngredientBodyFields(body)) return false;

  if (
    (hasOwnProperty(body, "proteins") && !isNumber(body.proteins))
    ||
    (hasOwnProperty(body, "fats") && !isNumber(body.fats))
    ||
    (hasOwnProperty(body, "carbohydrates") && !isNumber(body.carbohydrates))
    ||
    (hasOwnProperty(body, "calories") && !isNumber(body.calories))
  ) return false;

  return isNewLocString(body.nameLoc) && isNewLocString(body.stockMeasureLoc);
};


export type EditIngredientBody = Omit<NewIngredientBody, 'nameLoc' | 'stockMeasureLoc'>
& {
  nameLoc: EditLocString;
  stockMeasureLoc: EditLocString;
};
  
type EditIngredientBodyFields = MapToUnknown<EditIngredientBody>;
  
const hasEditIngredientBodyFields = (body: unknown): body is EditIngredientBodyFields =>
  hasOwnProperty(body, 'nameLoc') && hasOwnProperty(body, 'stockMeasureLoc');
  
export const isEditIngredientBody = (body: unknown): body is EditIngredientBody => {
  if (!hasEditIngredientBodyFields(body)) return false;

  if (
    (hasOwnProperty(body, "proteins") && !isNumber(body.proteins))
    ||
    (hasOwnProperty(body, "fats") && !isNumber(body.fats))
    ||
    (hasOwnProperty(body, "carbohydrates") && !isNumber(body.carbohydrates))
    ||
    (hasOwnProperty(body, "calories") && !isNumber(body.calories))
  ) return false;

  return isEditLocString(body.nameLoc) && isEditLocString(body.stockMeasureLoc);
};