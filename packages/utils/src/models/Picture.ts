import type { MapToUnknown, MapToDT } from "../types/helpers.js";
import type { PictureData } from "@m-cafe-app/db";
import type { LocStringDT } from "./LocString.js";
import { isNumber, isString } from "../types/typeParsers.js";
import { hasOwnProperty } from "../types/helpers.js";
import { isLocStringDT } from "./LocString.js";


export type PictureDT = Omit<MapToDT<PictureData>, 'altTextLocId'>
& {
  altTextLoc: LocStringDT;
};

type PictureDTFields = MapToUnknown<PictureDT>;

const hasPictureDTFields = (obj: unknown): obj is PictureDTFields =>
  hasOwnProperty(obj, "id") && hasOwnProperty(obj, "src") && hasOwnProperty(obj, "altTextLoc");

export const isPictureDT = (obj: unknown): obj is PictureDT =>
  hasPictureDTFields(obj) && isNumber(obj.id) && isString(obj.src) && isLocStringDT(obj.altTextLoc);