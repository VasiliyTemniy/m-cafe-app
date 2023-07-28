import { isNumber, isString } from "./typeParsers.js";
import { InferAttributes } from "sequelize";
import { MapToFrontendData, MapToUnknown, PropertiesCreationOptional } from "./helpers.js";
import { User } from "../models/User.js";

export type UserData = Omit<InferAttributes<User>, PropertiesCreationOptional>
  & { id: number; };

type UserDataFields = MapToUnknown<UserData>;

const hasUserDataFields = (user: unknown): user is UserDataFields =>
  Object.prototype.hasOwnProperty.call(user, "id")
  &&
  Object.prototype.hasOwnProperty.call(user, "phonenumber");

export const isUserData = (user: unknown): user is UserData => {
  if (hasUserDataFields(user)) {
    if (isNumber(user.id) && isString(user.phonenumber)) return true;
  }
  return false;
};

export type UserDataTransit = Omit<MapToFrontendData<UserData>, 'passwordHash'>;