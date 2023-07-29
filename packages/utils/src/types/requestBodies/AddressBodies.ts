import { InferAttributes } from "sequelize";
import { Address, AddressDT, isAddressDT } from "../../models";
import { MapToDT, MapToUnknown, PropertiesCreationOptional } from "../helpers";
import { isString, isNumber } from "../typeParsers.js";

export type NewAddressBody = MapToDT<Omit<InferAttributes<Address>, PropertiesCreationOptional>>;

type NewAddressBodyFields = MapToUnknown<NewAddressBody>;

const hasNewAddressBodyFields = (body: unknown): body is NewAddressBodyFields =>
  Object.prototype.hasOwnProperty.call(body, "city")
  &&
  Object.prototype.hasOwnProperty.call(body, "street");

export const isNewAddressBody = (body: unknown): body is NewAddressBody => {
  if (!hasNewAddressBodyFields(body)) return false;

  if (
    (Object.prototype.hasOwnProperty.call(body, "region") && !isString(body.region))
    ||
    (Object.prototype.hasOwnProperty.call(body, "district") && !isString(body.district))
    ||
    (Object.prototype.hasOwnProperty.call(body, "house") && !isString(body.house))
    ||
    (Object.prototype.hasOwnProperty.call(body, "entrance") && !isString(body.entrance))
    ||
    (Object.prototype.hasOwnProperty.call(body, "floor") && !isNumber(body.floor))
    ||
    (Object.prototype.hasOwnProperty.call(body, "flat") && !isString(body.flat))
    ||
    (Object.prototype.hasOwnProperty.call(body, "entranceKey") && !isString(body.entranceKey))
  ) return false;

  return isString(body.city) && isString(body.street);
};

export type EditAddressBody = AddressDT;

export const isEditAddressBody = (body: unknown): body is EditAddressBody =>
  isAddressDT(body);