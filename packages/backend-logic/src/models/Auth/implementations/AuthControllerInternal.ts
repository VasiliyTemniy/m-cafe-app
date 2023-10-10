import { isAuthDTResponse, type AuthDTRequest, type AuthDTURequest, type AuthResponse, type CredentialsRequest, type VerifyResponse } from '@m-cafe-app/models';
import type { IAuthControllerInternal, IAuthService, IAuthServiceExternalGrpcClient } from '../interfaces';
import { ApplicationError, GrpcClientError, isBoolean, isString } from '@m-cafe-app/utils';

export class AuthControllerInternal implements IAuthControllerInternal {
  constructor(
    private readonly authServiceExternal: IAuthServiceExternalGrpcClient,
    private readonly authServiceInternal: IAuthService
  ) {}

  private tokenPublicKey: Buffer = Buffer.from('');

  getAll(): Promise<void> {
    throw new ApplicationError('Method not implemented.');
  }

  getById(): Promise<void> {
    throw new ApplicationError('Method not implemented.');
  }

  create(req: AuthDTRequest): Promise<AuthResponse> {

    const { id, lookupHash, password } = req;

    return new Promise<AuthResponse>((resolve, reject) => {
      this.authServiceExternal.createAuth({ id, lookupHash, password }, 
        (err, response) => {
          if (err)
            return reject(new GrpcClientError(err.message));
          if (!isAuthDTResponse(response))
            return reject(new GrpcClientError('Invalid response from external service'));

          const realResponse: AuthResponse = {
            id: Number(response.id),
            token: response.token,
            error: response.error
          };

          resolve(realResponse);
        }
      );
    });
  }

  update(req: AuthDTURequest): Promise<AuthResponse> {
    
    const { id, lookupHash, oldPassword, newPassword } = req;

    return new Promise<AuthResponse>((resolve, reject) => {
      this.authServiceExternal.updateAuth({ id, lookupHash, oldPassword, newPassword }, 
        (err, response) => {
          if (err)
            return reject(new GrpcClientError(err.message));
          if (!isAuthDTResponse(response))
            return reject(new GrpcClientError('Invalid response from external service'));

          const realResponse: AuthResponse = {
            id: Number(response.id),
            token: response.token,
            error: response.error
          };

          resolve(realResponse);
        }
      );
    });
  }

  grant(req: AuthDTRequest): Promise<AuthResponse> {
    
    const { id, lookupHash, password } = req;

    return new Promise<AuthResponse>((resolve, reject) => {
      this.authServiceExternal.grantAuth({ id, lookupHash, password }, 
        (err, response) => {
          if (err)
            return reject(new GrpcClientError(err.message));
          if (!isAuthDTResponse(response))
            return reject(new GrpcClientError('Invalid response from external service'));

          const realResponse: AuthResponse = {
            id: Number(response.id),
            token: response.token,
            error: response.error
          };

          resolve(realResponse);
        }
      );
    });
  }

  verifyCredentials(req: CredentialsRequest): Promise<VerifyResponse> {
    
    const { lookupHash, password } = req;

    return new Promise<VerifyResponse>((resolve, reject) => {
      this.authServiceExternal.verifyCredentials({ lookupHash, password }, 
        (err, response) => {
          if (err)
            return reject(new GrpcClientError(err.message));
          if (!response)
            return reject(new GrpcClientError('No response from external service'));
          if (!isBoolean(response.success) || !isString(response.error))
            return reject(new GrpcClientError('Invalid response from external service'));

          const realResponse: VerifyResponse = {
            success: response.success,
            error: response.error
          };

          resolve(realResponse);
        }
      );
    });
  }

  verifyToken(req: { token: string }): Promise<AuthResponse> {
    
    const { token } = req;

    return new Promise<AuthResponse>((resolve, reject) => {
      this.authServiceExternal.verifyToken({ token }, 
        (err, response) => {
          if (err)
            return reject(new GrpcClientError(err.message));
          if (!isAuthDTResponse(response))
            return reject(new GrpcClientError('Invalid response from external service'));

          const realResponse: AuthResponse = {
            id: Number(response.id),
            token: response.token,
            error: response.error
          };

          resolve(realResponse);
        }
      );
    });
  }

  verifyTokenInternal(req: { token: string; }): AuthResponse {
    
    const { token } = req;

    if (!this.authServiceInternal.verifyTokenInternal)
      throw new ApplicationError('Method not implemented, please use external service');

    if (!this.tokenPublicKey)
      throw new ApplicationError('tokenPublicKey was not initialized');

    return this.authServiceInternal.verifyTokenInternal(token, this.tokenPublicKey, 'simple-micro-auth');
  }

  refreshToken(req: { token: string }): Promise<AuthResponse> {
    
    const { token } = req;

    return new Promise<AuthResponse>((resolve, reject) => {
      this.authServiceExternal.refreshToken({ token }, 
        (err, response) => {
          if (err)
            return reject(new GrpcClientError(err.message));
          if (!isAuthDTResponse(response))
            return reject(new GrpcClientError('Invalid response from external service'));

          const realResponse: AuthResponse = {
            id: Number(response.id),
            token: response.token,
            error: response.error
          };

          resolve(realResponse);
        }
      );
    });
  }

  async getPublicKey(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.authServiceExternal.getPublicKey({ target: 'token' },
        (err, response) => {
          if (err)
            return reject(new GrpcClientError(err.message));
          if (!response)
            return reject(new GrpcClientError('No response from external service'));
          if (!response.publicKey)
            return reject(new GrpcClientError('Invalid response from external service'));

          this.tokenPublicKey = response.publicKey;
          resolve();
        }
      );
    });
  }

  remove(req: { lookupHash: string }): Promise<{ error: string }> {

    const { lookupHash } = req;

    return new Promise<{ error: string }>((resolve, reject) => {
      this.authServiceExternal.deleteAuth({ lookupHash }, 
        (err, response) => {
          if (err)
            return reject(new GrpcClientError(err.message));
          if (!response)
            return reject(new GrpcClientError('No response from external service'));
          if (!isString(response.error))
            return reject(new GrpcClientError('Invalid response from external service'));

          const realResponse: { error: string } = {
            error: response.error
          };
        
          resolve(realResponse);
        }
      );
    });
  }

  flushExternalDB(): Promise<{ error: string }> {
    if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development')
      throw new ApplicationError('Attempt to flush DB in prod!');

    return new Promise<{ error: string }>((resolve, reject) => {
      this.authServiceExternal.FlushDB({ reason: 'test' },
        (err, response) => {
          if (err)
            return reject(new GrpcClientError(err.message));
          if (!response)
            return reject(new GrpcClientError('No response from external service'));
          if (!isString(response.error))
            return reject(new GrpcClientError('Invalid response from external service'));

          const realResponse: { error: string } = {
            error: response.error
          };

          resolve(realResponse);
        }
      );
    });
  }
}