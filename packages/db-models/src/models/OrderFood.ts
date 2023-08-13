import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey, NonAttribute } from 'sequelize';
import { PropertiesCreationOptional } from '../types/helpers.js';
import { Food } from './Food.js';
import { Order } from './Order.js';

export class OrderFood extends Model<InferAttributes<OrderFood>, InferCreationAttributes<OrderFood>> {
  declare id: CreationOptional<number>;
  declare orderId: ForeignKey<Order['id']>;
  declare foodId: ForeignKey<Food['id']> | null;
  declare amount: number;
  declare archivePrice: number;
  declare archiveFoodName: string;
  declare food?: NonAttribute<Food>;
}


export type OrderFoodData = Omit<InferAttributes<OrderFood>, PropertiesCreationOptional>
  & { id: number; };