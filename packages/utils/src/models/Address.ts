import { AddressData } from "@m-cafe-app/db-models";
import { isNumber, isString } from "../types/typeParsers.js";
import { hasOwnProperty, MapToDT, MapToUnknown } from "../types/helpers.js";

export type AddressDT = MapToDT<AddressData>;

type AddressDTFields = MapToUnknown<AddressDT>;

const hasAddressDTFields = (address: unknown): address is AddressDTFields =>
  hasOwnProperty(address, "id") && hasOwnProperty(address, "city") && hasOwnProperty(address, "street");

export const isAddressDT = (address: unknown): address is AddressDT => {
  if (!hasAddressDTFields(address)) return false;

  if (
    (hasOwnProperty(address, "cityDistrict") && !isString(address.cityDistrict))
    ||
    (hasOwnProperty(address, "region") && !isString(address.region))
    ||
    (hasOwnProperty(address, "regionDistrict") && !isString(address.regionDistrict))
    ||
    (hasOwnProperty(address, "house") && !isString(address.house))
    ||
    (hasOwnProperty(address, "entrance") && !isString(address.entrance))
    ||
    (hasOwnProperty(address, "floor") && !isNumber(address.floor))
    ||
    (hasOwnProperty(address, "flat") && !isString(address.flat))
    ||
    (hasOwnProperty(address, "entranceKey") && !isString(address.entranceKey))
  ) return false;

  return isNumber(address.id) && isString(address.city) && isString(address.street);
};