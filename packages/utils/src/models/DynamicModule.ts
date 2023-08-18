import { DynamicModuleData } from "@m-cafe-app/db-models";
import { isNumber, isString } from "../types/typeParsers.js";
import { hasOwnProperty, MapToDT, MapToUnknown } from "../types/helpers.js";
import { isLocStringDT, LocStringDT } from "./LocString.js";
import { isPictureDT, PictureDT } from "./Picture.js";


export type DynamicModuleDT = Omit<MapToDT<DynamicModuleData>, 'locStringId' | 'pictureId'>
& {
  locString?: LocStringDT;
  picture?: PictureDT;
};

type DynamicModuleDTFields = MapToUnknown<DynamicModuleDT>;

const hasDynamicModuleDTFields = (obj: unknown): obj is DynamicModuleDTFields =>
  hasOwnProperty(obj, "id")
  &&
  hasOwnProperty(obj, "moduleType")
  &&
  hasOwnProperty(obj, "page")
  &&
  hasOwnProperty(obj, "placement")
  &&
  hasOwnProperty(obj, "placementType");

export const isDynamicModuleDT = (obj: unknown): obj is DynamicModuleDT => {
  if (!hasDynamicModuleDTFields(obj)) return false;

  if (
    (hasOwnProperty(obj, "className") && !isString(obj.className))
    ||
    (hasOwnProperty(obj, "inlineCss") && !isString(obj.inlineCss))
    ||
    (hasOwnProperty(obj, "url") && !isString(obj.url))
    ||
    (hasOwnProperty(obj, "locString") && !isLocStringDT(obj.locString))
    ||
    (hasOwnProperty(obj, "picture") && !isPictureDT(obj.picture))
  ) return false;
  
  return isNumber(obj.id)
  &&
  isString(obj.moduleType)
  &&
  isString(obj.page)
  &&
  isNumber(obj.placement)
  &&
  isString(obj.placementType);
};