import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { User } from './User.js';
import { Address } from './Address.js';
import { PropertiesCreationOptional } from '../types/helpers.js';
import { OrderFood } from './OrderFood.js';

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare addressId: ForeignKey<Address['id']> | null;
  declare deliverAt: Date;
  declare status: string;
  declare totalCost: number;
  declare archiveAddress: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare user?: NonAttribute<User>;
  declare address?: NonAttribute<Address>;
  declare orderFoods?: NonAttribute<OrderFood>;
}


export type OrderData = Omit<InferAttributes<Order>, PropertiesCreationOptional>
  & { id: number; };