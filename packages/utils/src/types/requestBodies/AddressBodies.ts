import { InferAttributes } from "sequelize";
import { Address } from "../../models";
import { hasOwnProperty, MapToDT, MapToUnknown, PropertiesCreationOptional } from "../helpers.js";
import { isString, isNumber } from "../typeParsers.js";

export type NewAddressBody = MapToDT<Omit<InferAttributes<Address>, PropertiesCreationOptional>>;

type NewAddressBodyFields = MapToUnknown<NewAddressBody>;

const hasNewAddressBodyFields = (body: unknown): body is NewAddressBodyFields =>
  hasOwnProperty(body, "city") && hasOwnProperty(body, "street");

export const isNewAddressBody = (body: unknown): body is NewAddressBody => {
  if (!hasNewAddressBodyFields(body)) return false;

  if (
    (hasOwnProperty(body, "region") && !isString(body.region))
    ||
    (hasOwnProperty(body, "district") && !isString(body.district))
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