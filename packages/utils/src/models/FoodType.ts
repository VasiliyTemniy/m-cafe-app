import type { MapToUnknown, MapToDT } from "../types/helpers.js";
import type { FoodTypeData } from "@m-cafe-app/db";
import type { LocStringDT } from "./LocString.js";
import { isNumber } from "../types/typeParsers.js";
import { hasOwnProperty } from "../types/helpers.js";
import { isLocStringDT } from "./LocString.js";


export type FoodTypeDT = Omit<MapToDT<FoodTypeData>, 'nameLocId' | 'descriptionLocId'>
& {
  nameLoc: LocStringDT;
  descriptionLoc: LocStringDT;
};

type FoodTypeDTFields = MapToUnknown<FoodTypeDT>;

const hasFoodTypeDTFields = (obj: unknown): obj is FoodTypeDTFields =>
  hasOwnProperty(obj, "id")
  &&
  hasOwnProperty(obj, "nameLoc")
  &&
  hasOwnProperty(obj, "descriptionLoc");

export const isFoodTypeDT = (obj: unknown): obj is FoodTypeDT =>
  hasFoodTypeDTFields(obj)
  &&
  isNumber(obj.id)
  &&
  isLocStringDT(obj.nameLoc)
  &&
  isLocStringDT(obj.descriptionLoc);