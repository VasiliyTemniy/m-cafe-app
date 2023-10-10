import type { IAuthService } from '../interfaces';
import { AuthResponse } from '@m-cafe-app/models';
import { AuthorizationError } from '@m-cafe-app/utils';
import jwt from 'jsonwebtoken';
import { isCustomPayload } from '../../../utils';

export class AuthServiceInternal implements IAuthService {
  verifyTokenInternal(token: string, tokenPublicKey: Buffer, issuer: string): AuthResponse {
    
    const payload = jwt.verify(token, tokenPublicKey, { algorithms: ['RS256'], issuer });

    if (typeof payload === 'string' || payload instanceof String || !isCustomPayload(payload))
      throw new AuthorizationError('Malformed token');
  
    return new AuthResponse(payload.id, token, '');
  }
}