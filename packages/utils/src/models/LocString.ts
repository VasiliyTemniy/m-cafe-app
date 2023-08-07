import { LocStringData } from "@m-cafe-app/db-models";
import { isNumber, isString } from "../types/typeParsers.js";
import { hasOwnProperty, MapToDT, MapToUnknown } from "../types/helpers.js";


export type LocStringDT = MapToDT<LocStringData>;

type LocStringDTFields = MapToUnknown<LocStringDT>;

const hasLocStringDTFields = (obj: unknown): obj is LocStringDTFields =>
  hasOwnProperty(obj, "id")
  &&
  hasOwnProperty(obj, "ruString");

export const isLocStringDT = (obj: unknown): obj is LocStringDT => {
  if (!hasLocStringDTFields(obj)) return false;

  if (
    (hasOwnProperty(obj, "enString") && !isString(obj.enString))
    ||
    (hasOwnProperty(obj, "altString") && !isString(obj.altString))
  ) return false;

  return isNumber(obj.id) && isString(obj.ruString);
};

export type NewLocString = Omit<LocStringDT, 'id'>;

type NewLocStringFields = MapToUnknown<NewLocString>;

const hasNewLocStringFields = (obj: unknown): obj is NewLocStringFields =>
  hasOwnProperty(obj, "ruString");

export const isNewLocString = (obj: unknown): obj is NewLocString => {
  if (!hasNewLocStringFields(obj)) return false;

  if (
    (hasOwnProperty(obj, "enString") && !isString(obj.enString))
    ||
    (hasOwnProperty(obj, "altString") && !isString(obj.altString))
  ) return false;

  return isString(obj.ruString);
};

export type EditLocString = LocStringDT;

export const isEditLocString = (obj: unknown): obj is EditLocString =>
  isLocStringDT(obj);