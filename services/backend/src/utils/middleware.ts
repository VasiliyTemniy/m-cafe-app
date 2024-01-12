import {
  AuthConnectionHandler,
  AuthController,
  AuthServiceInternal,
  ControllerExpressHttpMiddleware,
  SessionRepoRedis,
  SessionService,
  UserRepoSequelizePG
} from '@m-market-app/backend-logic';
import { redisSessionClient } from '@m-market-app/backend-logic/build/config';
import config from '@m-market-app/backend-logic';


export const middleware = new ControllerExpressHttpMiddleware(
  new UserRepoSequelizePG(),
  new SessionService(
    new SessionRepoRedis(redisSessionClient)
  ),
  new AuthController(
    new AuthConnectionHandler(
      config.authUrl,
      config.authGrpcCredentials
    ),
    new AuthServiceInternal()
  )
);