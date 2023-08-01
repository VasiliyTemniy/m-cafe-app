import { Model, InferAttributes, InferCreationAttributes, ForeignKey } from '@m-cafe-app/shared-backend-deps/sequelize.js';
import { User } from './User.js';
import { Address } from './Address.js';

export class UserAddress extends Model<InferAttributes<UserAddress>, InferCreationAttributes<UserAddress>> {
  declare userId: ForeignKey<User['id']>;
  declare addressId: ForeignKey<Address['id']>;
}