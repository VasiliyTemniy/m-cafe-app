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


// Example: one query string part for a request
// api request record has path_prefix === '/api/v1/'
// api request has one param with path_postfix === null
// separator from api_request_query_string_parts === '?'
// key === 'key'
// => https://example.com/api/v1/<subject_param_key_value><path_postfix><separator><key>=<subject_key_value>
// => query https://example.com/api/v1/<subject_param_key_value>?key=<subject_key_value>
//
// Example: two query string parts for a request
// api request record has path_prefix === '/api/v1/'
// api request has one param with path_postfix === null
// Two query string parts:
// First: separator1 === '?'; key1 === 'key1'
// Second: separator2 === '&'; key2 === 'key2'
// => https://example.com/api/v1/<subject_param_key_value><path_postfix><separator1><key1>=<subject_key1_value><separator2><key2>=<subject_key2_value>
// => query https://example.com/api/v1/<subject_param_key_value>?key1=<subject_key1_value>&key2=<subject_key2_value>


export class ApiRequestQueryStringPart extends
  Model<InferAttributes<ApiRequestQueryStringPart>, InferCreationAttributes<ApiRequestQueryStringPart>> {
  declare id: CreationOptional<number>;
  declare apiRequestId: ForeignKey<ApiRequest['id']>;
  declare orderNumber: number;
  declare key: string;
  declare subjectKey: string;
  declare separator: string | null;
  declare approvedBy: ForeignKey<User['id']> | null;
  declare apiRequest?: NonAttribute<ApiRequest>;
  declare approvedByAppAdmin?: NonAttribute<User>;
}

  
export const initApiRequestQueryStringPartModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      ApiRequestQueryStringPart.init({
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
        // query string part key name
        key: {
          type: DataTypes.STRING,
          allowNull: false
        },
        // query string part value; taken from given subject with the following key
        subjectKey: {
          type: DataTypes.STRING,
          allowNull: false
        },
        // applied before query string part, not after
        separator: {
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
        modelName: 'api_request_query_string_part',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initApiRequestQueryStringPartAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      ApiRequestQueryStringPart.belongsTo(ApiRequest, {
        targetKey: 'id',
        foreignKey: 'apiRequestId',
        as: 'apiRequest',
      });

      ApiRequestQueryStringPart.belongsTo(User, {
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