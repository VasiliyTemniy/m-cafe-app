import type { MapToUnknown, MapToDT } from "../types/helpers.js";
import type { FoodData } from "@m-cafe-app/db";
import type { LocStringDT } from "./LocString.js";
import type { FoodTypeDT } from "./FoodType.js";
import type { FoodComponentDT } from "./FoodComponent.js";
import type { PictureDT } from "./Picture.js";
import { isNumber } from "../types/typeParsers.js";
import { hasOwnProperty } from "../types/helpers.js";
import { isLocStringDT } from "./LocString.js";
import { isFoodTypeDT } from "./FoodType.js";
import { isFoodComponentDT } from "./FoodComponent.js";
import { isPictureDT } from "./Picture.js";


export type FoodDT = Omit<MapToDT<FoodData>, 'nameLocId' | 'descriptionLocId' | 'foodTypeId'>
& {
  nameLoc: LocStringDT;
  descriptionLoc: LocStringDT;
  foodType: FoodTypeDT;
  foodComponents?: FoodComponentDT[];
  mainPicture?: PictureDT;
  gallery?: PictureDT[];
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

export const isFoodDT = (obj: unknown): obj is FoodDT => {
  if (!hasFoodDTFields(obj)) return false;
  
  if (obj.foodComponents) {
    if (!Array.isArray(obj.foodComponents)) return false;
    for (const foodComponent of obj.foodComponents)
      if (!isFoodComponentDT(foodComponent)) return false;
  }

  if (obj.gallery) {
    if (!Array.isArray(obj.gallery)) return false;
    for (const picture of obj.gallery)
      if (!isPictureDT(picture)) return false;
  }

  if (hasOwnProperty(obj, 'mainPicture')) if (!isPictureDT(obj.mainPicture)) return false;
  
  return isNumber(obj.id)
  &&
  isLocStringDT(obj.nameLoc)
  &&
  isLocStringDT(obj.descriptionLoc)
  &&
  isFoodTypeDT(obj.foodType)
  &&
  isNumber(obj.price);
};

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