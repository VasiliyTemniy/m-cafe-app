import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyRemoveAssociationMixin
} from 'sequelize';
import { PropertiesCreationOptional } from "../types/helpers.js";
import { Address } from './Address.js';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare username?: string;
  declare name?: string;
  declare passwordHash: string;
  declare phonenumber: string;
  declare email?: string;
  declare birthdate?: Date;
  declare rights: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date>;
  declare addAddress: HasManyAddAssociationMixin<Address, number>;
  declare getAddresses: HasManyGetAssociationsMixin<Address>;
  declare removeAddress: HasManyRemoveAssociationMixin<Address, number>;
}


export type UserData = Omit<InferAttributes<User>, PropertiesCreationOptional | 'rights'>
  & { id: number; rights: string; };