import type { AuthDTRequest, AuthDTURequest, AuthResponse, CredentialsRequest, VerifyResponse } from '@m-cafe-app/models';
import type { ICRUDController } from '../../../utils';

export interface IAuthController extends ICRUDController {
  connect(): Promise<void>;
  ping(): Promise<void>;
  close(): Promise<void>;
  create(req: AuthDTRequest): Promise<AuthResponse>;
  update(req: AuthDTURequest): Promise<AuthResponse>;
  grant(req: AuthDTRequest): Promise<AuthResponse>;
  verifyCredentials(req: CredentialsRequest): Promise<VerifyResponse>;
  verifyToken(req: { token: string }): Promise<AuthResponse>;
  verifyTokenInternal(req: { token: string }): AuthResponse;
  refreshToken(req: { token: string }): Promise<AuthResponse>;
  getPublicKey(): Promise<void>;
  remove(req: { lookupHash: string }): Promise<{ error: string }>;
  flushExternalDB(): Promise<{ error: string }>;
}