import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { User } from './User.js';
import { ApiRequest } from './ApiRequest.js';


export class ApiRequestHeader extends Model<InferAttributes<ApiRequestHeader>, InferCreationAttributes<ApiRequestHeader>> {
  declare id: CreationOptional<number>;
  declare apiRequestId: ForeignKey<ApiRequest['id']>;
  declare key: string;
  declare value: string;
  declare approvedBy: ForeignKey<User['id']> | null;
  declare apiRequest?: NonAttribute<ApiRequest>;
  declare approvedByAppAdmin?: NonAttribute<User>;
}

  
export const initApiRequestHeaderModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      ApiRequestHeader.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        apiRequestId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'api_requests', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        key: {
          type: DataTypes.STRING,
          allowNull: false
        },
        value: {
          type: DataTypes.STRING,
          allowNull: false
        },
        approvedBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'api_request_header'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initApiRequestHeaderAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      ApiRequestHeader.belongsTo(ApiRequest, {
        targetKey: 'id',
        foreignKey: 'apiRequestId',
        as: 'apiRequest',
      });

      ApiRequestHeader.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'approvedBy',
        as: 'approvedByAppAdmin',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};