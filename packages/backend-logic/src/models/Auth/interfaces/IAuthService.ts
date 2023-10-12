import type { AuthResponse } from '@m-cafe-app/models';

export interface IAuthService {
  verifyTokenInternal(token: string, tokenPublicKeyPem: string, issuer: string): AuthResponse;
}