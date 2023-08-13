import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { PropertiesCreationOptional } from "../types/helpers.js";

export class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>> {
  declare id: CreationOptional<number>;
  declare region?: string;
  declare regionDistrict?: string;
  declare city: string;
  declare cityDistrict?: string;
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