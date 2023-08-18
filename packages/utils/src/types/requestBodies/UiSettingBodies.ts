import { UiSettingDT } from "../../models/UiSetting.js";
import { hasOwnProperty, MapToUnknown } from "../helpers.js";
import { isString } from "../typeParsers.js";

export type NewUiSettingBody = Omit<UiSettingDT, 'id'>;

type NewUiSettingBodyFields = MapToUnknown<NewUiSettingBody>;

const hasNewUiSettingBodyFields = (body: unknown): body is NewUiSettingBodyFields =>
  hasOwnProperty(body, 'name') && hasOwnProperty(body, 'value');

export const isNewUiSettingBody = (body: unknown): body is NewUiSettingBody =>
  hasNewUiSettingBodyFields(body) && isString(body.name) && isString(body.value);


export type EditUiSettingBody = NewUiSettingBody;
  
type EditUiSettingBodyFields = MapToUnknown<EditUiSettingBody>;
  
const hasEditUiSettingBodyFields = (body: unknown): body is EditUiSettingBodyFields =>
  hasNewUiSettingBodyFields(body);
  
export const isEditUiSettingBody = (body: unknown): body is EditUiSettingBody =>
  hasEditUiSettingBodyFields(body) && isString(body.name) && isString(body.value);