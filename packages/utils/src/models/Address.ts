import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

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