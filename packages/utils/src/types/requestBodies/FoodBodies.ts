import { FoodDT } from "../../models/Food.js";
import { hasOwnProperty, MapToUnknown } from "../helpers.js";
import { EditLocString, isEditLocString, isNewLocString, NewLocString } from "../../models/LocString.js";
import { isNumber } from "../typeParsers.js";

export type NewFoodBody = Omit<FoodDT, 'id' | 'nameLoc' | 'descriptionLoc' | 'foodType'>
& {
  nameLoc: NewLocString;
  descriptionLoc: NewLocString;
  foodTypeId: number;
};

type NewFoodBodyFields = MapToUnknown<NewFoodBody>;

const hasNewFoodBodyFields = (body: unknown): body is NewFoodBodyFields =>
  hasOwnProperty(body, 'nameLoc')
  &&
  hasOwnProperty(body, 'descriptionLoc')
  &&
  hasOwnProperty(body, 'price')
  &&
  hasOwnProperty(body, 'foodTypeId');

export const isNewFoodBody = (body: unknown): body is NewFoodBody =>
  hasNewFoodBodyFields(body)
  &&
  isNewLocString(body.nameLoc)
  &&
  isNewLocString(body.descriptionLoc)
  &&
  isNumber(body.price)
  &&
  isNumber(body.foodTypeId);

export type EditFoodBody = Omit<NewFoodBody, 'nameLoc' | 'descriptionLoc'>
  & {
    nameLoc: EditLocString;
    descriptionLoc: EditLocString;
  };
    
  type EditFoodBodyFields = MapToUnknown<EditFoodBody>;
    
const hasEditFoodBodyFields = (body: unknown): body is EditFoodBodyFields =>
  hasOwnProperty(body, 'nameLoc')
  &&
  hasOwnProperty(body, 'descriptionLoc')
  &&
  hasOwnProperty(body, 'price')
  &&
  hasOwnProperty(body, 'foodTypeId');
    
export const isEditFoodBody = (body: unknown): body is EditFoodBody =>
  hasEditFoodBodyFields(body)
  &&
  isEditLocString(body.nameLoc)
  &&
  isEditLocString(body.descriptionLoc)
  &&
  isNumber(body.price)
  &&
  isNumber(body.foodTypeId);