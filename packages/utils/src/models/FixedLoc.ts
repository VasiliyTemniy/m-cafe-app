import type { FixedLocData } from "@m-cafe-app/db-models";
import { isNumber, isString } from "../types/typeParsers.js";
import { hasOwnProperty, MapToDT, MapToUnknown } from "../types/helpers.js";
import { isLocStringDT, LocStringDT } from "./LocString.js";


export type FixedLocDT = Omit<MapToDT<FixedLocData>, 'locStringId'>
& {
  locString: LocStringDT;
};

type FixedLocDTFields = MapToUnknown<FixedLocDT>;

const hasFixedLocDTFields = (obj: unknown): obj is FixedLocDTFields =>
  hasOwnProperty(obj, "id") && hasOwnProperty(obj, "name") && hasOwnProperty(obj, "locString");

export const isFixedLocDT = (obj: unknown): obj is FixedLocDT =>
  hasFixedLocDTFields(obj) && isNumber(obj.id) && isString(obj.name) && isLocStringDT(obj.locString);