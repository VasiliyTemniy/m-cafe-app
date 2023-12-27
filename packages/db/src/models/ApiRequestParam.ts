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


// Example: one param for a request means path_postfix is null for this param
// api request record has path_prefix === '/api/v1/'
// => https://example.com/api/v1/<subject_key_value><path_postfix>
// => query https://example.com/api/v1/<subject_key_value>
//
// Example: two params; the first has path_postfix === '/deep_example/'
// api request record has path_prefix === '/api/v1/'
// => https://example.com/api/v1/<subject_key_value><path_postfix><subject_key_value_2>
// => query https://example.com/api/v1/<subject_key_value>/deep_example/<subject_key_value_2>


export class ApiRequestParam extends Model<InferAttributes<ApiRequestParam>, InferCreationAttributes<ApiRequestParam>> {
  declare id: CreationOptional<number>;
  declare apiRequestId: ForeignKey<ApiRequest['id']>;
  declare orderNumber: number;
  declare subjectKey: string;
  declare pathPostfix: string | null;
  declare approvedBy: ForeignKey<User['id']> | null;
  declare apiRequest?: NonAttribute<ApiRequest>;
  declare approvedByAppAdmin?: NonAttribute<User>;
}

  
export const initApiRequestParamModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      ApiRequestParam.init({
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
        orderNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        // subject key/field/parameter name to write as request param
        subjectKey: {
          type: DataTypes.STRING,
          allowNull: false
        },
        // if path_postfix is null => this param is the last one; query string is applied after reaching this param
        pathPostfix: {
          type: DataTypes.STRING,
          allowNull: true
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
        modelName: 'api_request_param'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initApiRequestParamAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      ApiRequestParam.belongsTo(ApiRequest, {
        targetKey: 'id',
        foreignKey: 'apiRequestId',
        as: 'apiRequest',
      });

      ApiRequestParam.belongsTo(User, {
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