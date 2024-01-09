import type {
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  ForeignKey
} from 'sequelize';
import {
  ApiRequestExpectedResponseDataPlacementKey,
  ApiRequestExpectedResponseDataType,
  ApiRequestMethod,
  ApiRequestProtocol,
  ApiRequestReason,
  isApiRequestExpectedResponseDataPlacementKey,
  isApiRequestExpectedResponseDataType,
  isApiRequestMethod,
  isApiRequestProtocol,
  isApiRequestReason
} from '@m-cafe-app/shared-constants';
import { Model, DataTypes } from 'sequelize';
import { Organization } from './Organization.js';
import { User } from './User.js';


export class ApiRequest extends Model<InferAttributes<ApiRequest>, InferCreationAttributes<ApiRequest>> {
  declare id: CreationOptional<number>;
  declare organizationId: ForeignKey<Organization['id']>;
  declare createdBy: ForeignKey<User['id']>;
  declare updatedBy: ForeignKey<User['id']>;
  declare name: string;
  declare description: string;
  declare reason: ApiRequestReason;
  declare host: string;
  declare port: string;
  declare method: ApiRequestMethod;
  declare pathBeforeQuery: string;
  declare expectedResponseStatusCode: number;
  declare expectedResponseDataPlacementKey: ApiRequestExpectedResponseDataPlacementKey;
  declare expectedResponseDataType: ApiRequestExpectedResponseDataType;
  declare auth: string | null;
  declare defaultPort: string | null;
  declare family: string | null;
  declare hints: string | null;
  declare insecureHttpParser: boolean | null;
  declare joinDuplicateHeaders: boolean | null;
  declare localAddress: string | null;
  declare localPort: string | null;
  declare maxHeaderSize: number | null;
  declare protocol: ApiRequestProtocol | null;
  declare setHost: boolean | null;
  declare socketPath: boolean | null;
  declare timeout: number | null;
  declare approvedBy: ForeignKey<User['id']> | null;
  declare organization?: NonAttribute<Organization>;
  declare createdByAuthor?: NonAttribute<User>;
  declare updatedByAuthor?: NonAttribute<User>;
  declare approvedByAppAdmin?: NonAttribute<User>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

  
export const initApiRequestModel = async (dbInstance: Sequelize) => {
  return new Promise<void>((resolve, reject) => {
    try {
      // Assuming usage of node.http.request()
      // Approved_by === null => not approved => is inactive
      // Organization_id === null => this request is not related to any organization => app-wide-request record, e.g. auth handling api requests
      ApiRequest.init({
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        organizationId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'organizations', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        createdBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        updatedBy: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false
        },
        reason: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isApiRequestReasonValidator(value: unknown) {
              if (!isApiRequestReason(value)) {
                throw new Error(`Invalid api request reason: ${value}`);
              }
            }
          },
        },
        host: {
          type: DataTypes.STRING,
          allowNull: false
        },
        port: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        method: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isApiRequestMethodValidator(value: unknown) {
              if (!isApiRequestMethod(value)) {
                throw new Error(`Invalid api request method: ${value}`);
              }
            }
          },
        },
        // Path before query string - e.g. /api/v1/users
        pathBeforeQuery: {
          type: DataTypes.STRING,
          allowNull: false
        },
        expectedResponseStatusCode: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        expectedResponseDataPlacementKey: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isApiRequestExpectedResponseDataPlacementKeyValidator(value: unknown) {
              if (!isApiRequestExpectedResponseDataPlacementKey(value)) {
                throw new Error(`Invalid api request expected response data placement key: ${value}`);
              }
            }
          },
        },
        expectedResponseDataType: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isApiRequestExpectedResponseDataTypeValidator(value: unknown) {
              if (!isApiRequestExpectedResponseDataType(value)) {
                throw new Error(`Invalid api request expected response data type: ${value}`);
              }
            }
          },
        },
        // auth <string> Basic authentication ('user:password') to compute an Authorization header. (from NodeJS docs)
        auth: {
          type: DataTypes.STRING,
          allowNull: true
        },
        // defaultPort <number> Default port for the protocol. Default: agent.defaultPort if an Agent is used, else undefined. (from NodeJS docs)
        defaultPort: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        // family <number> IP address family to use when resolving host or hostname. Valid values are 4 or 6. When unspecified, both IP v4 and v6 will be used. (from NodeJS docs)
        family: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        // hints <number> Optional dns.lookup() hints. (from NodeJS docs)
        hints: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        // insecureHTTPParser <boolean> If set to true, it will use a HTTP parser with leniency flags enabled. Using the insecure parser should be avoided. See --insecure-http-parser for more information. Default: false (from NodeJS docs)
        // CAUTION! Map this key to upper case HTTP if used. To make it insecureHTTPParser here, it would have to be insecure_h_t_t_p_parser in migration, which is ugly
        insecureHttpParser: {
          type: DataTypes.BOOLEAN,
          allowNull: true
        },
        // joinDuplicateHeaders <boolean> It joins the field line values of multiple headers in a request with , instead of discarding the duplicates. See message.headers for more information. Default: false. (from NodeJS docs)
        joinDuplicateHeaders: {
          type: DataTypes.BOOLEAN,
          allowNull: true
        },
        // localAddress <string> Local interface to bind for network connections. (from NodeJS docs)
        localAddress: {
          type: DataTypes.STRING,
          allowNull: true
        },
        // localPort <number> Local port to connect from. (from NodeJS docs)
        localPort: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        // maxHeaderSize <number> Optionally overrides the value of --max-http-header-size (the maximum length of response headers in bytes) for responses received from the server. Default: 16384 (16 KiB). (from NodeJS docs)
        maxHeaderSize: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        // protocol <string> Protocol to use. Default: 'http:'. (from NodeJS docs)
        protocol: {
          type: DataTypes.SMALLINT,
          allowNull: true,
          validate: {
            isApiRequestProtocolValidator(value: unknown) {
              if (!isApiRequestProtocol(value)) {
                throw new Error(`Invalid api request protocol: ${value}`);
              }
            }
          },
        },
        // setHost <boolean>: Specifies whether or not to automatically add the Host header. Defaults to true. (from NodeJS docs)
        setHost: {
          type: DataTypes.BOOLEAN,
          allowNull: true
        },
        // socketPath <string> Unix domain socket. Cannot be used if one of host or port is specified, as those specify a TCP Socket. (from NodeJS docs)
        socketPath: {
          type: DataTypes.STRING,
          allowNull: true
        },
        // timeout <number>: A number specifying the socket timeout in milliseconds. This will set the timeout before the socket is connected.
        timeout: {
          type: DataTypes.INTEGER,
          allowNull: true
        },
        approvedBy: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT'
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }, {
        sequelize: dbInstance,
        underscored: true,
        timestamps: true,
        modelName: 'api_request'
      });

      resolve();
    } catch (err) {
      reject(err);
    }
  });
};


export const initApiRequestAssociations = async () => {
  return new Promise<void>((resolve, reject) => {
    try {

      ApiRequest.belongsTo(Organization, {
        targetKey: 'id',
        foreignKey: 'organizationId',
        as: 'organization',
      });

      ApiRequest.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'createdBy',
        as: 'createdByAuthor',
      });

      ApiRequest.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'updatedBy',
        as: 'updatedByAuthor',
      });

      ApiRequest.belongsTo(User, {
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