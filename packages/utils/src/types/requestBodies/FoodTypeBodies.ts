import { FoodTypeDT } from "../../models/FoodType.js";
import { hasOwnProperty, MapToUnknown } from "../helpers.js";
import { EditLocString, isEditLocString, isNewLocString, NewLocString } from "../../models/LocString.js";

export type NewFoodTypeBody = Omit<FoodTypeDT, 'id' | 'nameLoc' | 'descriptionLoc'>
& {
  nameLoc: NewLocString;
  descriptionLoc: NewLocString;
};

type NewFoodTypeBodyFields = MapToUnknown<NewFoodTypeBody>;

const hasNewFoodTypeBodyFields = (body: unknown): body is NewFoodTypeBodyFields =>
  hasOwnProperty(body, 'nameLoc') && hasOwnProperty(body, 'descriptionLoc');

export const isNewFoodTypeBody = (body: unknown): body is NewFoodTypeBody =>
  hasNewFoodTypeBodyFields(body) && isNewLocString(body.nameLoc) && isNewLocString(body.descriptionLoc);


export type EditFoodTypeBody = Omit<NewFoodTypeBody, 'nameLoc' | 'descriptionLoc'>
& {
  nameLoc: EditLocString;
  descriptionLoc: EditLocString;
};
  
type EditFoodTypeBodyFields = MapToUnknown<EditFoodTypeBody>;
  
const hasEditFoodTypeBodyFields = (body: unknown): body is EditFoodTypeBodyFields =>
  hasOwnProperty(body, 'nameLoc') && hasOwnProperty(body, 'descriptionLoc');
  
export const isEditFoodTypeBody = (body: unknown): body is EditFoodTypeBody =>
  hasEditFoodTypeBodyFields(body) && isEditLocString(body.nameLoc) && isEditLocString(body.descriptionLoc);