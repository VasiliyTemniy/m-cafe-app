import { Model, InferAttributes, InferCreationAttributes, CreationOptional, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyRemoveAssociationMixin } from 'sequelize';
import { isBoolean, isNumber, isString } from "../types/typeParsers";
import { MapToDT, MapToUnknown, PropertiesCreationOptional } from "../types/helpers.js";
import { Address } from './Address';
import { Session } from './Session';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare username?: string;
  declare name?: string;
  declare passwordHash: string;
  declare phonenumber: string;
  declare email?: string;
  declare birthdate?: Date;
  declare disabled?: boolean;
  declare admin?: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare getSessions: HasManyGetAssociationsMixin<Session>;
  declare addAddress: HasManyAddAssociationMixin<Address, number>;
  declare getAddresses: HasManyGetAssociationsMixin<Address>;
  declare removeAddress: HasManyRemoveAssociationMixin<Address, number>;
}


export type UserData = Omit<InferAttributes<User>, PropertiesCreationOptional>
  & { id: number; };

export type UserDT = Omit<MapToDT<UserData>, 'passwordHash'>;

type UserDTFields = MapToUnknown<UserDT>;

const hasUserDTFields = (obj: unknown): obj is UserDTFields =>
  Object.prototype.hasOwnProperty.call(obj, "id")
  &&
  Object.prototype.hasOwnProperty.call(obj, "phonenumber");

export const isUserDT = (obj: unknown): obj is UserDT => {
  if (!hasUserDTFields(obj)) return false;

  if (
    (Object.prototype.hasOwnProperty.call(obj, "username") && !isString(obj.username))
    ||
    (Object.prototype.hasOwnProperty.call(obj, "name") && !isString(obj.name))
    ||
    (Object.prototype.hasOwnProperty.call(obj, "email") && !isString(obj.email))
    ||
    (Object.prototype.hasOwnProperty.call(obj, "birthdate") && !isString(obj.birthdate))
    ||
    (Object.prototype.hasOwnProperty.call(obj, "disabled") && !isBoolean(obj.disabled))
    ||
    (Object.prototype.hasOwnProperty.call(obj, "admin") && !isBoolean(obj.admin))
  ) return false;

  return isNumber(obj.id) && isString(obj.phonenumber);
};