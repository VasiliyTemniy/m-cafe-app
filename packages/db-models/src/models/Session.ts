import { Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from '@m-cafe-app/shared-backend-deps/sequelize.js';
import { User } from './User.js';

export class Session extends Model<InferAttributes<Session>, InferCreationAttributes<Session>> {
  declare id: CreationOptional<number>;
  declare userId: ForeignKey<User['id']>;
  declare token: string;
  declare userAgent: string;
}