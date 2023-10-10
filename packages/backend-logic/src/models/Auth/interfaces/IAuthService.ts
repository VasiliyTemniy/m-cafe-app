import type { AuthResponse } from '@m-cafe-app/models';
import type { AuthServiceClient } from '../../../external/interfaces/auth/AuthService';

export interface IAuthService {
  verifyTokenInternal(token: string, tokenPublicKey: Buffer, issuer: string): AuthResponse;
}

export interface IAuthServiceExternalGrpcClient extends AuthServiceClient {
}