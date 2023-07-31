import { Model, InferAttributes, InferCreationAttributes, CreationOptional, HasManyGetAssociationsMixin, HasManyAddAssociationMixin, HasManyRemoveAssociationMixin } from 'sequelize';
import { isBoolean, isNumber, isString } from "../types/typeParsers.js";
import { hasOwnProperty, MapToDT, MapToUnknown, PropertiesCreationOptional } from "../types/helpers.js";
import { Address } from './Address.js';
import { Session } from './Session.js';

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
  declare deletedAt: CreationOptional<Date>;
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
  hasOwnProperty(obj, "id")
  &&
  hasOwnProperty(obj, "phonenumber");

export const isUserDT = (obj: unknown): obj is UserDT => {
  if (!hasUserDTFields(obj)) return false;

  if (
    (hasOwnProperty(obj, "username") && !isString(obj.username))
    ||
    (hasOwnProperty(obj, "name") && !isString(obj.name))
    ||
    (hasOwnProperty(obj, "email") && !isString(obj.email))
    ||
    (hasOwnProperty(obj, "birthdate") && !isString(obj.birthdate))
    ||
    (hasOwnProperty(obj, "disabled") && !isBoolean(obj.disabled))
    ||
    (hasOwnProperty(obj, "admin") && !isBoolean(obj.admin))
  ) return false;

  return isNumber(obj.id) && isString(obj.phonenumber);
};