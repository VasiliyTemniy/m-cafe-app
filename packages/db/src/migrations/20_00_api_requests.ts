import type { MigrationContext } from '../types/Migrations.js';
// import { ApiRequestExpectedResponseDataPlacementKey, ApiRequestExpectedResponseDataType, ApiRequestMethod, ApiRequestProtocol, ApiRequestReason } from '@m-cafe-app/shared-constants';
import { DataTypes } from 'sequelize';

export const up = async ({ context: queryInterface }: MigrationContext) => {
  // Assuming usage of node.http.request()
  // Approved_by === null => not approved => is inactive
  // Organization_id === null => this request is not related to any organization => app-wide-request record, e.g. auth handling api requests
  await queryInterface.createTable('api_requests', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    organization_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'organizations', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    updated_by: {
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
      // validate: {
      //   isIn: [Object.values(ApiRequestReason)]
      // }
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
      // validate: {
      //   isIn: [Object.values(ApiRequestMethod)]
      // }
    },
    // Path before query string - e.g. /api/v1/users
    path_before_query: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expected_response_status_code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    expected_response_data_placement_key: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      // validate: {
      //   isIn: [Object.values(ApiRequestExpectedResponseDataPlacementKey)]
      // }
    },
    expected_response_data_type: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      // validate: {
      //   isIn: [Object.values(ApiRequestExpectedResponseDataType)]
      // }
    },
    // auth <string> Basic authentication ('user:password') to compute an Authorization header. (from NodeJS docs)
    auth: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // defaultPort <number> Default port for the protocol. Default: agent.defaultPort if an Agent is used, else undefined. (from NodeJS docs)
    default_port: {
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
    insecure_http_parser: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    // joinDuplicateHeaders <boolean> It joins the field line values of multiple headers in a request with , instead of discarding the duplicates. See message.headers for more information. Default: false. (from NodeJS docs)
    join_duplicate_headers: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    // localAddress <string> Local interface to bind for network connections. (from NodeJS docs)
    local_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // localPort <number> Local port to connect from. (from NodeJS docs)
    local_port: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // maxHeaderSize <number> Optionally overrides the value of --max-http-header-size (the maximum length of response headers in bytes) for responses received from the server. Default: 16384 (16 KiB). (from NodeJS docs)
    max_header_size: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    // protocol <string> Protocol to use. Default: 'http:'. (from NodeJS docs)
    protocol: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      // validate: {
      //   isIn: [Object.values(ApiRequestProtocol)]
      // }
    },
    // setHost <boolean>: Specifies whether or not to automatically add the Host header. Defaults to true. (from NodeJS docs)
    set_host: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    // socketPath <string> Unix domain socket. Cannot be used if one of host or port is specified, as those specify a TCP Socket. (from NodeJS docs)
    socket_path: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // timeout <number>: A number specifying the socket timeout in milliseconds. This will set the timeout before the socket is connected.
    timeout: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    approved_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'users', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });
};

export const down = async ({ context: queryInterface }: MigrationContext) => {
  await queryInterface.dropTable('api_requests');
};