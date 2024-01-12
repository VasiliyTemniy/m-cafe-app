import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey
} from 'sequelize';
import { Model, DataTypes } from 'sequelize';
import { ApiRequest } from './ApiRequest.js';
import { ApiRequestTokenPlacement, isApiRequestTokenPlacement } from '@m-market-app/shared-constants';

// The only one api request table that does not need app admin approval

export class ApiRequestToken extends Model<InferAttributes<ApiRequestToken>, InferCreationAttributes<ApiRequestToken>> {
  declare id: CreationOptional<number>;
  declare apiRequestId: ForeignKey<ApiRequest['id']>;
  declare key: string;
  declare value: string;
  declare placement: ApiRequestTokenPlacement;
  declare prefix: string | null;
  declare apiRequest?: NonAttribute<ApiRequest>;
}

  
export const initApiRequestTokenModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      ApiRequestToken.init({
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
        placement: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isApiRequestTokenPlacementValidator(value: unknown) {
              if (!isApiRequestTokenPlacement(value)) {
                throw new Error(`Invalid api request token placement: ${value}`);
              }
            }
          },
        },
        // prefix example: 'Bearer ' with essential space in the end if there is one
        prefix: {
          type: DataTypes.STRING,
          allowNull: true
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: false,
        modelName: 'api_request_token'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initApiRequestTokenAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      ApiRequestToken.belongsTo(ApiRequest, {
        targetKey: 'id',
        foreignKey: 'apiRequestId',
        as: 'apiRequest',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};