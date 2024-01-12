import type { JwtPayload } from 'jsonwebtoken';
import type { IAuthService } from '../interfaces';
import { AuthResponse } from '@m-market-app/models';
import { AuthorizationError, UnknownError } from '@m-market-app/utils';
import jwt from 'jsonwebtoken';
import { isCustomPayload } from '../../../utils';

export class AuthServiceInternal implements IAuthService {
  verifyTokenInternal(token: string, tokenPublicKeyPem: string, issuer: string): AuthResponse {
    
    let payload: JwtPayload | string;

    try {
      payload = jwt.verify(token, tokenPublicKeyPem, { algorithms: ['RS256'], issuer });
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        if (e.name === 'TokenExpiredError') return new AuthResponse(0, '', `TokenExpiredError: ${e.message}`);
        else return new AuthResponse(0, '', `AuthorizationError: ${e.message}`);
      }
      throw new UnknownError('Error while verifying token');
    }

    if (typeof payload === 'string' || payload instanceof String || !isCustomPayload(payload))
      throw new AuthorizationError('Malformed token');
  
    return new AuthResponse(payload.id, token, '');
  }
}