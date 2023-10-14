import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type { AuthServiceClient as _auth_AuthServiceClient, AuthServiceDefinition as _auth_AuthServiceDefinition } from './auth/AuthService';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  auth: {
    AuthRequest: MessageTypeDefinition
    AuthResponse: MessageTypeDefinition
    AuthService: SubtypeConstructor<typeof grpc.Client, _auth_AuthServiceClient> & { service: _auth_AuthServiceDefinition }
    CredentialsRequest: MessageTypeDefinition
    DeleteAuthRequest: MessageTypeDefinition
    DeleteAuthResponse: MessageTypeDefinition
    FlushDBRequest: MessageTypeDefinition
    FlushDBResponse: MessageTypeDefinition
    PingRequest: MessageTypeDefinition
    PingResponse: MessageTypeDefinition
    PublicKeyRequest: MessageTypeDefinition
    PublicKeyResponse: MessageTypeDefinition
    RefreshTokenRequest: MessageTypeDefinition
    UpdateAuthRequest: MessageTypeDefinition
    VerifyResponse: MessageTypeDefinition
    VerifyTokenRequest: MessageTypeDefinition
  }
}

