import { FixedLocDT } from "../../models/FixedLoc.js";
import { isNewLocString, NewLocString, isEditLocString, EditLocString } from "../../models/LocString.js";
import { hasOwnProperty, MapToUnknown } from "../helpers.js";
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