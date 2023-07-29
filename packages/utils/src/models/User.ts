import { Model, InferAttributes, InferCreationAttributes, CreationOptional, HasManyGetAssociationsMixin } from 'sequelize';
import { Session } from './Session';
import { isBoolean, isNumber, isString } from "../types/typeParsers";
import { MapToDT, MapToUnknown, PropertiesCreationOptional } from "../types/helpers.js";

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
}


export type UserData = Omit<InferAttributes<User>, PropertiesCreationOptional>
  & { id: number; };

export type UserDT = Omit<MapToDT<UserData>, 'passwordHash'>;

type UserDTFields = MapToUnknown<UserDT>;

const hasUserDTFields = (user: unknown): user is UserDTFields =>
  Object.prototype.hasOwnProperty.call(user, "id")
  &&
  Object.prototype.hasOwnProperty.call(user, "phonenumber");

export const isUserDT = (user: unknown): user is UserDT => {
  if (!hasUserDTFields(user)) return false;

  if (
    (Object.prototype.hasOwnProperty.call(user, "username") && !isString(user.username))
    ||
    (Object.prototype.hasOwnProperty.call(user, "name") && !isString(user.name))
    ||
    (Object.prototype.hasOwnProperty.call(user, "email") && !isString(user.email))
    ||
    (Object.prototype.hasOwnProperty.call(user, "birthdate") && !isString(user.birthdate))
    ||
    (Object.prototype.hasOwnProperty.call(user, "disabled") && !isBoolean(user.disabled))
    ||
    (Object.prototype.hasOwnProperty.call(user, "admin") && !isBoolean(user.admin))
  ) return false;

  return isNumber(user.id) && isString(user.phonenumber);
};