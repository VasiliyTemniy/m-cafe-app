import type { AuthResponse } from '@m-market-app/models';

export interface IAuthService {
  verifyTokenInternal(token: string, tokenPublicKeyPem: string, issuer: string): AuthResponse;
}