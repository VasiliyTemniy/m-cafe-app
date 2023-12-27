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


// Example: expected response: { "id": "example_id", "token": "example_token" }
// That needs to be written in some DB table with columns: userId, authToken
// DB records for expected response:
// First: key === 'id'; subject_key === 'userId'
// Second: key === 'token'; subject_key === 'authToken'


export class ApiResponseExpectation extends
  Model<InferAttributes<ApiResponseExpectation>, InferCreationAttributes<ApiResponseExpectation>> {
  declare id: CreationOptional<number>;
  declare apiRequestId: ForeignKey<ApiRequest['id']>;
  declare key: string;
  declare subjectKey: string;
  declare approvedBy: ForeignKey<User['id']> | null;
  declare apiRequest?: NonAttribute<ApiRequest>;
  declare approvedByAppAdmin?: NonAttribute<User>;
}

  
export const initApiResponseExpectationModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      ApiResponseExpectation.init({
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
        subjectKey: {
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
        modelName: 'api_response_expectation',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initApiResponseExpectationAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      ApiResponseExpectation.belongsTo(ApiRequest, {
        targetKey: 'id',
        foreignKey: 'apiRequestId',
        as: 'apiRequest',
      });

      ApiResponseExpectation.belongsTo(User, {
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