import type { ProtoGrpcType } from '../interfaces/auth.js';
import grpc from '@grpc/grpc-js';
import config from '../../config.js';

const authProto = grpc.loadPackageDefinition(config.packageDefinitionAuth) as unknown as ProtoGrpcType;

export const authServiceExternalGRPC = new authProto.auth.AuthService(
  config.authUrl,
  grpc.credentials.createInsecure(),
);