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


// Given some User record { username: 'example_username', password: 'example_password' }
//
// Example: Desired body is { "username": "<username>", "password": "<password>" }
// Two body parts:
// First: key === 'username'; subject_key === 'username'
// Second: key === 'password'; subject_key === 'password'
// Resulting body is { "username": "example_username", "password": "example_password" }
//
// Given some User record { lookupHash: 'example_lookupHash', phonenumber: 'example_phonenumber' }
//
// Example: Desired body is { "username": "<username>", "password": "<password>" }
// But our DB does not hold 'username' fields, for example.
// Use some another unique User key instead, for example - 'lookupHash'
// Our DB does not hold 'password', either.
// Use another unique User key instead, for example - 'phonenumber'
// Two body parts:
// First: key === 'username'; subject_key === 'lookupHash'
// Second: key === 'password'; subject_key === 'phonenumber'
// Resulting body is { "username": "example_lookupHash", "password": "example_phonenumber" }


export class ApiRequestBodyPart extends
  Model<InferAttributes<ApiRequestBodyPart>, InferCreationAttributes<ApiRequestBodyPart>> {
  declare id: CreationOptional<number>;
  declare apiRequestId: ForeignKey<ApiRequest['id']>;
  declare key: string;
  declare subjectKey: string;
  declare approvedBy: ForeignKey<User['id']> | null;
  declare apiRequest?: NonAttribute<ApiRequest>;
  declare approvedByAppAdmin?: NonAttribute<User>;
}

  
export const initApiRequestBodyPartModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      ApiRequestBodyPart.init({
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
        modelName: 'api_request_body_part',
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initApiRequestBodyPartAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      ApiRequestBodyPart.belongsTo(ApiRequest, {
        targetKey: 'id',
        foreignKey: 'apiRequestId',
        as: 'apiRequest',
      });

      ApiRequestBodyPart.belongsTo(User, {
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