import type { MapToUnknown } from "../helpers.js";
import type { FixedLocDT } from "../../models/FixedLoc.js";
import type { EditLocString, NewLocString } from "../../models/LocString.js";
import { isFixedLocDT } from "../../models/FixedLoc.js";
import { isNewLocString, isEditLocString } from "../../models/LocString.js";
import { hasOwnProperty } from "../helpers.js";
import { isString } from "../typeParsers.js";

export type NewFixedLocBody = Omit<FixedLocDT, 'id' | 'locString'>
& {
  locString: NewLocString;
};

type NewFixedLocBodyFields = MapToUnknown<NewFixedLocBody>;

const hasNewFixedLocBodyFields = (body: unknown): body is NewFixedLocBodyFields =>
  hasOwnProperty(body, 'name') && hasOwnProperty(body, 'locString');

export const isNewFixedLocBody = (body: unknown): body is NewFixedLocBody =>
  hasNewFixedLocBodyFields(body) && isString(body.name) && isNewLocString(body.locString);


export type EditFixedLocBody = Omit<NewFixedLocBody, 'locString'>
& {
  locString: EditLocString;
};
  
type EditFixedLocBodyFields = MapToUnknown<EditFixedLocBody>;
  
const hasEditFixedLocBodyFields = (body: unknown): body is EditFixedLocBodyFields =>
  hasNewFixedLocBodyFields(body);
  
export const isEditFixedLocBody = (body: unknown): body is EditFixedLocBody =>
  hasEditFixedLocBodyFields(body) && isString(body.name) && isEditLocString(body.locString);


export type EditManyFixedLocBody = {
  updLocs: Array<FixedLocDT>
};
    
type EditManyFixedLocBodyFields = MapToUnknown<EditManyFixedLocBody>;

const hasEditManyFixedLocBodyFields = (body: unknown): body is EditManyFixedLocBodyFields =>
  hasOwnProperty(body, 'updLocs');
  
export const isEditManyFixedLocBody = (body: unknown): body is EditManyFixedLocBody => {
  if (!hasEditManyFixedLocBodyFields(body)) return false;

  if (!Array.isArray(body.updLocs)) return false;

  for (const updLoc of body.updLocs) {
    if (!isFixedLocDT(updLoc)) return false;
  }

  return true;
};