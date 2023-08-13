import { AddressDT } from "../../models/Address.js";
import { hasOwnProperty, MapToUnknown } from "../helpers.js";
import { isString, isNumber } from "../typeParsers.js";

export type NewAddressBody = Omit<AddressDT, 'id'>;

type NewAddressBodyFields = MapToUnknown<NewAddressBody>;

const hasNewAddressBodyFields = (body: unknown): body is NewAddressBodyFields =>
  hasOwnProperty(body, "city") && hasOwnProperty(body, "street");

export const isNewAddressBody = (body: unknown): body is NewAddressBody => {
  if (!hasNewAddressBodyFields(body)) return false;

  if (
    (hasOwnProperty(body, "cityDistrict") && !isString(body.cityDistrict))
    ||
    (hasOwnProperty(body, "region") && !isString(body.region))
    ||
    (hasOwnProperty(body, "regionDistrict") && !isString(body.regionDistrict))
    ||
    (hasOwnProperty(body, "house") && !isString(body.house))
    ||
    (hasOwnProperty(body, "entrance") && !isString(body.entrance))
    ||
    (hasOwnProperty(body, "floor") && !isNumber(body.floor))
    ||
    (hasOwnProperty(body, "flat") && !isString(body.flat))
    ||
    (hasOwnProperty(body, "entranceKey") && !isString(body.entranceKey))
  ) return false;

  return isString(body.city) && isString(body.street);
};

export type EditAddressBody = NewAddressBody;

export const isEditAddressBody = (body: unknown): body is EditAddressBody =>
  isNewAddressBody(body);