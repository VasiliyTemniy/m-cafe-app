import type { MapToUnknown, MapToDT } from "../types/helpers.js";
import type { UiSettingData } from "@m-cafe-app/db";
import { isNumber, isString } from "../types/typeParsers.js";
import { hasOwnProperty } from "../types/helpers.js";


export type UiSettingDT = MapToDT<UiSettingData>;

type UiSettingDTFields = MapToUnknown<UiSettingDT>;

const hasUiSettingDTFields = (obj: unknown): obj is UiSettingDTFields =>
  hasOwnProperty(obj, "id") && hasOwnProperty(obj, "name") && hasOwnProperty(obj, "value");

export const isUiSettingDT = (obj: unknown): obj is UiSettingDT =>
  hasUiSettingDTFields(obj) && isNumber(obj.id) && isString(obj.name) && isString(obj.value);