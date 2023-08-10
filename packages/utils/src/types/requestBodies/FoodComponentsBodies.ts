import { FoodComponentDT } from "../../models";
import { hasOwnProperty, MapToUnknown } from "../helpers.js";
import { isBoolean, isNumber } from "../typeParsers.js";

export type NewFoodComponent = Omit<FoodComponentDT, 'id' | 'component'>
& {
  componentId: number;
};

type NewFoodComponentFields = MapToUnknown<NewFoodComponent>;

export type AddFoodComponentsBody = {
  foodComponents: NewFoodComponent[];
};

const hasAddFoodComponentsBodyFields = (body: unknown): body is { foodComponents: unknown } =>
  hasOwnProperty(body, 'foodComponents');

const hasNewFoodComponentFields = (obj: unknown): obj is NewFoodComponentFields =>
  hasOwnProperty(obj, 'componentId') && (hasOwnProperty(obj, 'amount') && hasOwnProperty(obj, 'compositeFood'));

export const isAddFoodComponentsBody = (body: unknown): body is AddFoodComponentsBody => {
  if (!hasAddFoodComponentsBodyFields(body) || !Array.isArray(body.foodComponents)) return false;

  for (const component of body.foodComponents) {
    if (
      !hasNewFoodComponentFields(component)
      ||
      !isNumber(component.componentId)
      ||
      !isNumber(component.amount)
      ||
      !isBoolean(component.compositeFood)
    )
      return false;
  }
  
  return true;
};


export type EditFoodComponentBody = NewFoodComponent;

type EditFoodComponentBodyFields = MapToUnknown<EditFoodComponentBody>;

const hasEditFoodComponentBodyFields = (body: unknown): body is EditFoodComponentBodyFields =>
  hasNewFoodComponentFields(body);

export const isEditFoodComponentBody = (body: unknown): body is EditFoodComponentBody => 
  hasEditFoodComponentBodyFields(body)
  &&
  isNumber(body.componentId)
  &&
  isNumber(body.amount)
  &&
  isBoolean(body.compositeFood);