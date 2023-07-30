import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { isNumber, isString } from "../types/typeParsers.js";
import { hasOwnProperty, MapToDT, MapToUnknown, PropertiesCreationOptional } from "../types/helpers.js";

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
  hasOwnProperty(address, "id") && hasOwnProperty(address, "city") && hasOwnProperty(address, "street");

export const isAddressDT = (address: unknown): address is AddressDT => {
  if (!hasAddressDTFields(address)) return false;

  if (
    (hasOwnProperty(address, "region") && !isString(address.region))
    ||
    (hasOwnProperty(address, "district") && !isString(address.district))
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