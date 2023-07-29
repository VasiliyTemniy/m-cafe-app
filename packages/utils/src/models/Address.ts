import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { isNumber, isString } from "../types/typeParsers";
import { MapToDT, MapToUnknown, PropertiesCreationOptional } from "../types/helpers.js";

export class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>> {
  declare id: CreationOptional<number>;
  declare region?: string;
  declare district?: string;
  declare city: string;
  declare street: string;
  declare house?: string;
  declare entrance?: string;
  declare floor?: number;
  declare flat?: string;
  declare entranceKey?: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export type AddressData = Omit<InferAttributes<Address>, PropertiesCreationOptional>
  & { id: number; };

export type AddressDT = MapToDT<AddressData>;

type AddressDTFields = MapToUnknown<AddressDT>;

const hasAddressDTFields = (address: unknown): address is AddressDTFields =>
  Object.prototype.hasOwnProperty.call(address, "id")
  &&
  Object.prototype.hasOwnProperty.call(address, "city")
  &&
  Object.prototype.hasOwnProperty.call(address, "street");

export const isAddressDT = (address: unknown): address is AddressDT => {
  if (!hasAddressDTFields(address)) return false;

  if (
    (Object.prototype.hasOwnProperty.call(address, "region") && !isString(address.region))
    ||
    (Object.prototype.hasOwnProperty.call(address, "district") && !isString(address.district))
    ||
    (Object.prototype.hasOwnProperty.call(address, "house") && !isString(address.house))
    ||
    (Object.prototype.hasOwnProperty.call(address, "entrance") && !isString(address.entrance))
    ||
    (Object.prototype.hasOwnProperty.call(address, "floor") && !isNumber(address.floor))
    ||
    (Object.prototype.hasOwnProperty.call(address, "flat") && !isString(address.flat))
    ||
    (Object.prototype.hasOwnProperty.call(address, "entranceKey") && !isString(address.entranceKey))
  ) return false;

  return isNumber(address.id) && isString(address.city) && isString(address.street);
};