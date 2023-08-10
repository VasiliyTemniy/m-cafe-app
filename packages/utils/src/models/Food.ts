import { FoodData } from "@m-cafe-app/db-models";
import { isNumber } from "../types/typeParsers.js";
import { hasOwnProperty, MapToDT, MapToUnknown } from "../types/helpers.js";
import { isLocStringDT, LocStringDT } from "./LocString.js";
import { FoodTypeDT, isFoodTypeDT } from "./FoodType.js";


export type FoodDT = Omit<MapToDT<FoodData>, 'nameLocId' | 'descriptionLocId' | 'foodTypeId'>
& {
  nameLoc: LocStringDT;
  descriptionLoc: LocStringDT;
  foodType: FoodTypeDT;
};

type FoodDTFields = MapToUnknown<FoodDT>;

const hasFoodDTFields = (obj: unknown): obj is FoodDTFields =>
  hasOwnProperty(obj, "id")
  &&
  hasOwnProperty(obj, "nameLoc")
  &&
  hasOwnProperty(obj, "descriptionLoc")
  &&
  hasOwnProperty(obj, "foodType")
  &&
  hasOwnProperty(obj, "price");

export const isFoodDT = (obj: unknown): obj is FoodDT =>
  hasFoodDTFields(obj)
  &&
  isNumber(obj.id)
  &&
  isLocStringDT(obj.nameLoc)
  &&
  isLocStringDT(obj.descriptionLoc)
  &&
  isFoodTypeDT(obj.foodType)
  &&
  isNumber(obj.price);


export type FoodDTS = Omit<MapToDT<FoodData>, 'nameLocId' | 'descriptionLocId' | 'foodTypeId' | 'price'>
  & {
    nameLoc: LocStringDT;
  };
  
type FoodDTSFields = MapToUnknown<FoodDTS>;


const hasFoodDTSFields = (obj: unknown): obj is FoodDTSFields =>
  hasOwnProperty(obj, "id")
  &&
  hasOwnProperty(obj, "nameLoc");

export const isFoodDTS = (obj: unknown): obj is FoodDTS =>
  hasFoodDTSFields(obj)
  &&
  isNumber(obj.id)
  &&
  isLocStringDT(obj.nameLoc);