// Original file: src/protos/auth.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type { AuthRequest as _auth_AuthRequest, AuthRequest__Output as _auth_AuthRequest__Output } from '../auth/AuthRequest';
import type { AuthResponse as _auth_AuthResponse, AuthResponse__Output as _auth_AuthResponse__Output } from '../auth/AuthResponse';
import type { CredentialsRequest as _auth_CredentialsRequest, CredentialsRequest__Output as _auth_CredentialsRequest__Output } from '../auth/CredentialsRequest';
import type { DeleteAuthRequest as _auth_DeleteAuthRequest, DeleteAuthRequest__Output as _auth_DeleteAuthRequest__Output } from '../auth/DeleteAuthRequest';
import type { DeleteAuthResponse as _auth_DeleteAuthResponse, DeleteAuthResponse__Output as _auth_DeleteAuthResponse__Output } from '../auth/DeleteAuthResponse';
import type { FlushDBRequest as _auth_FlushDBRequest, FlushDBRequest__Output as _auth_FlushDBRequest__Output } from '../auth/FlushDBRequest';
import type { FlushDBResponse as _auth_FlushDBResponse, FlushDBResponse__Output as _auth_FlushDBResponse__Output } from '../auth/FlushDBResponse';
import type { PublicKeyRequest as _auth_PublicKeyRequest, PublicKeyRequest__Output as _auth_PublicKeyRequest__Output } from '../auth/PublicKeyRequest';
import type { PublicKeyResponse as _auth_PublicKeyResponse, PublicKeyResponse__Output as _auth_PublicKeyResponse__Output } from '../auth/PublicKeyResponse';
import type { TokenRequest as _auth_TokenRequest, TokenRequest__Output as _auth_TokenRequest__Output } from '../auth/TokenRequest';
import type { UpdateAuthRequest as _auth_UpdateAuthRequest, UpdateAuthRequest__Output as _auth_UpdateAuthRequest__Output } from '../auth/UpdateAuthRequest';
import type { VerifyResponse as _auth_VerifyResponse, VerifyResponse__Output as _auth_VerifyResponse__Output } from '../auth/VerifyResponse';

export interface AuthServiceClient extends grpc.Client {
  CreateAuth(argument: _auth_AuthRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  CreateAuth(argument: _auth_AuthRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  CreateAuth(argument: _auth_AuthRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  CreateAuth(argument: _auth_AuthRequest, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  createAuth(argument: _auth_AuthRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  createAuth(argument: _auth_AuthRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  createAuth(argument: _auth_AuthRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  createAuth(argument: _auth_AuthRequest, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  
  DeleteAuth(argument: _auth_DeleteAuthRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_DeleteAuthResponse__Output>): grpc.ClientUnaryCall;
  DeleteAuth(argument: _auth_DeleteAuthRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_DeleteAuthResponse__Output>): grpc.ClientUnaryCall;
  DeleteAuth(argument: _auth_DeleteAuthRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_DeleteAuthResponse__Output>): grpc.ClientUnaryCall;
  DeleteAuth(argument: _auth_DeleteAuthRequest, callback: grpc.requestCallback<_auth_DeleteAuthResponse__Output>): grpc.ClientUnaryCall;
  deleteAuth(argument: _auth_DeleteAuthRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_DeleteAuthResponse__Output>): grpc.ClientUnaryCall;
  deleteAuth(argument: _auth_DeleteAuthRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_DeleteAuthResponse__Output>): grpc.ClientUnaryCall;
  deleteAuth(argument: _auth_DeleteAuthRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_DeleteAuthResponse__Output>): grpc.ClientUnaryCall;
  deleteAuth(argument: _auth_DeleteAuthRequest, callback: grpc.requestCallback<_auth_DeleteAuthResponse__Output>): grpc.ClientUnaryCall;
  
  FlushDB(argument: _auth_FlushDBRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_FlushDBResponse__Output>): grpc.ClientUnaryCall;
  FlushDB(argument: _auth_FlushDBRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_FlushDBResponse__Output>): grpc.ClientUnaryCall;
  FlushDB(argument: _auth_FlushDBRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_FlushDBResponse__Output>): grpc.ClientUnaryCall;
  FlushDB(argument: _auth_FlushDBRequest, callback: grpc.requestCallback<_auth_FlushDBResponse__Output>): grpc.ClientUnaryCall;
  flushDb(argument: _auth_FlushDBRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_FlushDBResponse__Output>): grpc.ClientUnaryCall;
  flushDb(argument: _auth_FlushDBRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_FlushDBResponse__Output>): grpc.ClientUnaryCall;
  flushDb(argument: _auth_FlushDBRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_FlushDBResponse__Output>): grpc.ClientUnaryCall;
  flushDb(argument: _auth_FlushDBRequest, callback: grpc.requestCallback<_auth_FlushDBResponse__Output>): grpc.ClientUnaryCall;
  
  GetPublicKey(argument: _auth_PublicKeyRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_PublicKeyResponse__Output>): grpc.ClientUnaryCall;
  GetPublicKey(argument: _auth_PublicKeyRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_PublicKeyResponse__Output>): grpc.ClientUnaryCall;
  GetPublicKey(argument: _auth_PublicKeyRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_PublicKeyResponse__Output>): grpc.ClientUnaryCall;
  GetPublicKey(argument: _auth_PublicKeyRequest, callback: grpc.requestCallback<_auth_PublicKeyResponse__Output>): grpc.ClientUnaryCall;
  getPublicKey(argument: _auth_PublicKeyRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_PublicKeyResponse__Output>): grpc.ClientUnaryCall;
  getPublicKey(argument: _auth_PublicKeyRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_PublicKeyResponse__Output>): grpc.ClientUnaryCall;
  getPublicKey(argument: _auth_PublicKeyRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_PublicKeyResponse__Output>): grpc.ClientUnaryCall;
  getPublicKey(argument: _auth_PublicKeyRequest, callback: grpc.requestCallback<_auth_PublicKeyResponse__Output>): grpc.ClientUnaryCall;
  
  GrantAuth(argument: _auth_AuthRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  GrantAuth(argument: _auth_AuthRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  GrantAuth(argument: _auth_AuthRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  GrantAuth(argument: _auth_AuthRequest, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  grantAuth(argument: _auth_AuthRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  grantAuth(argument: _auth_AuthRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  grantAuth(argument: _auth_AuthRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  grantAuth(argument: _auth_AuthRequest, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  
  RefreshToken(argument: _auth_TokenRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  RefreshToken(argument: _auth_TokenRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  RefreshToken(argument: _auth_TokenRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  RefreshToken(argument: _auth_TokenRequest, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  refreshToken(argument: _auth_TokenRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  refreshToken(argument: _auth_TokenRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  refreshToken(argument: _auth_TokenRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  refreshToken(argument: _auth_TokenRequest, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  
  UpdateAuth(argument: _auth_UpdateAuthRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  UpdateAuth(argument: _auth_UpdateAuthRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  UpdateAuth(argument: _auth_UpdateAuthRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  UpdateAuth(argument: _auth_UpdateAuthRequest, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  updateAuth(argument: _auth_UpdateAuthRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  updateAuth(argument: _auth_UpdateAuthRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  updateAuth(argument: _auth_UpdateAuthRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  updateAuth(argument: _auth_UpdateAuthRequest, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  
  VerifyCredentials(argument: _auth_CredentialsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_VerifyResponse__Output>): grpc.ClientUnaryCall;
  VerifyCredentials(argument: _auth_CredentialsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_VerifyResponse__Output>): grpc.ClientUnaryCall;
  VerifyCredentials(argument: _auth_CredentialsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_VerifyResponse__Output>): grpc.ClientUnaryCall;
  VerifyCredentials(argument: _auth_CredentialsRequest, callback: grpc.requestCallback<_auth_VerifyResponse__Output>): grpc.ClientUnaryCall;
  verifyCredentials(argument: _auth_CredentialsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_VerifyResponse__Output>): grpc.ClientUnaryCall;
  verifyCredentials(argument: _auth_CredentialsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_VerifyResponse__Output>): grpc.ClientUnaryCall;
  verifyCredentials(argument: _auth_CredentialsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_VerifyResponse__Output>): grpc.ClientUnaryCall;
  verifyCredentials(argument: _auth_CredentialsRequest, callback: grpc.requestCallback<_auth_VerifyResponse__Output>): grpc.ClientUnaryCall;
  
  VerifyToken(argument: _auth_TokenRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  VerifyToken(argument: _auth_TokenRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  VerifyToken(argument: _auth_TokenRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  VerifyToken(argument: _auth_TokenRequest, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _auth_TokenRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _auth_TokenRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _auth_TokenRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  verifyToken(argument: _auth_TokenRequest, callback: grpc.requestCallback<_auth_AuthResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface AuthServiceHandlers extends grpc.UntypedServiceImplementation {
  CreateAuth: grpc.handleUnaryCall<_auth_AuthRequest__Output, _auth_AuthResponse>;
  
  DeleteAuth: grpc.handleUnaryCall<_auth_DeleteAuthRequest__Output, _auth_DeleteAuthResponse>;
  
  FlushDB: grpc.handleUnaryCall<_auth_FlushDBRequest__Output, _auth_FlushDBResponse>;
  
  GetPublicKey: grpc.handleUnaryCall<_auth_PublicKeyRequest__Output, _auth_PublicKeyResponse>;
  
  GrantAuth: grpc.handleUnaryCall<_auth_AuthRequest__Output, _auth_AuthResponse>;
  
  RefreshToken: grpc.handleUnaryCall<_auth_TokenRequest__Output, _auth_AuthResponse>;
  
  UpdateAuth: grpc.handleUnaryCall<_auth_UpdateAuthRequest__Output, _auth_AuthResponse>;
  
  VerifyCredentials: grpc.handleUnaryCall<_auth_CredentialsRequest__Output, _auth_VerifyResponse>;
  
  VerifyToken: grpc.handleUnaryCall<_auth_TokenRequest__Output, _auth_AuthResponse>;
  
}

export interface AuthServiceDefinition extends grpc.ServiceDefinition {
  CreateAuth: MethodDefinition<_auth_AuthRequest, _auth_AuthResponse, _auth_AuthRequest__Output, _auth_AuthResponse__Output>
  DeleteAuth: MethodDefinition<_auth_DeleteAuthRequest, _auth_DeleteAuthResponse, _auth_DeleteAuthRequest__Output, _auth_DeleteAuthResponse__Output>
  FlushDB: MethodDefinition<_auth_FlushDBRequest, _auth_FlushDBResponse, _auth_FlushDBRequest__Output, _auth_FlushDBResponse__Output>
  GetPublicKey: MethodDefinition<_auth_PublicKeyRequest, _auth_PublicKeyResponse, _auth_PublicKeyRequest__Output, _auth_PublicKeyResponse__Output>
  GrantAuth: MethodDefinition<_auth_AuthRequest, _auth_AuthResponse, _auth_AuthRequest__Output, _auth_AuthResponse__Output>
  RefreshToken: MethodDefinition<_auth_TokenRequest, _auth_AuthResponse, _auth_TokenRequest__Output, _auth_AuthResponse__Output>
  UpdateAuth: MethodDefinition<_auth_UpdateAuthRequest, _auth_AuthResponse, _auth_UpdateAuthRequest__Output, _auth_AuthResponse__Output>
  VerifyCredentials: MethodDefinition<_auth_CredentialsRequest, _auth_VerifyResponse, _auth_CredentialsRequest__Output, _auth_VerifyResponse__Output>
  VerifyToken: MethodDefinition<_auth_TokenRequest, _auth_AuthResponse, _auth_TokenRequest__Output, _auth_AuthResponse__Output>
}
