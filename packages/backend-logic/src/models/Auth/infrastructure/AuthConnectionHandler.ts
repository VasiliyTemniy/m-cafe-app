import type { AuthServiceClient, ProtoGrpcType } from '../../../external';
import grpc from '@grpc/grpc-js';
import config from '../../../config.js';
import { logger } from '@m-cafe-app/utils';

export interface IAuthConnectionHandler {
  connect(): Promise<void>;
  ping(): Promise<void>;
  close(): Promise<void>;
  authService: AuthServiceClient | undefined;
}

const authProto = grpc.loadPackageDefinition(config.packageDefinitionAuth) as unknown as ProtoGrpcType;

export class AuthConnectionHandler implements IAuthConnectionHandler {

  public authService: AuthServiceClient | undefined = undefined;

  constructor(
    readonly authUrl: string,
    readonly grpcCredentials?: grpc.ChannelCredentials,
    readonly options?: grpc.ClientOptions
  ) {}

  async connect(): Promise<void> {
    
    if (this.authService) return Promise.resolve();

    const credentials = this.grpcCredentials
      ? this.grpcCredentials
      : grpc.credentials.createInsecure();

    const connection = new Promise<void>((resolve, reject) => {
      try {
        this.authService = new authProto.auth.AuthService(
          this.authUrl,
          credentials,
          this.options,
        );
        logger.info('connected to auth microservice via grpc');

        resolve();
      } catch (err) {
        reject(err);
      }     
    });

    try {
      await connection;
      return Promise.resolve();
    } catch (err) {
      logger.error(err as string);
      logger.info('failed to connect to auth microservice via grpc');
      if (process.env.NODE_ENV === 'production') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        return await this.connect();
      } else {
        return process.exit(1);
      }
    }
  }

  async ping(): Promise<void> {

    if (!this.authService) {
      await this.connect();
      return this.ping();
    }

    const result = new Promise<void>((resolve, reject) => {
      if (!this.authService) reject();
      this.authService?.ping({ message: 'ping' }, (err, res) => {
        if (err) reject(err);
        if (res?.message === 'pong') resolve();
        reject();
      });
    });

    try {
      await result;
      return Promise.resolve();
    } catch (err) {
      if (process.env.NODE_ENV === 'production') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await this.close();
        await this.connect();
        return await this.ping();
      } else {
        return process.exit(1);
      }
    }
  }

  async close(): Promise<void> {
    
    if (!this.authService) return Promise.resolve();

    this.authService.close();

    return Promise.resolve();
  }

}