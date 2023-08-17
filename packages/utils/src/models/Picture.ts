import { PictureData } from "@m-cafe-app/db-models";
import { isNumber, isString } from "../types/typeParsers.js";
import { hasOwnProperty, MapToDT, MapToUnknown } from "../types/helpers.js";
import { isLocStringDT, LocStringDT } from "./LocString.js";


export type PictureDT = Omit<MapToDT<PictureData>, 'altTextLocId'>
& {
  altTextLoc: LocStringDT;
};

type PictureDTFields = MapToUnknown<PictureDT>;

const hasPictureDTFields = (obj: unknown): obj is PictureDTFields =>
  hasOwnProperty(obj, "id") && hasOwnProperty(obj, "src") && hasOwnProperty(obj, "altTextLoc");

export const isPictureDT = (obj: unknown): obj is PictureDT =>
  hasPictureDTFields(obj) && isNumber(obj.id) && isString(obj.src) && isLocStringDT(obj.altTextLoc);