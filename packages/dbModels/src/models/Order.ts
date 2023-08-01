import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from '@m-cafe-app/shared-backend-deps/sequelize.js';
import { User } from './User.js';
import { Address } from './Address.js';

export class Order extends Model<InferAttributes<Order>, InferCreationAttributes<Order>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare addressId: ForeignKey<Address['id']>;
  declare deliverAt: Date;
  declare status: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}