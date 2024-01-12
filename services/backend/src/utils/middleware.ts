import {
  AuthConnectionHandler,
  AuthController,
  AuthServiceInternal,
  ControllerExpressHttpMiddleware,
  SessionRepoRedis,
  SessionService,
  UserRepoSequelizePG
} from '@m-cafe-app/backend-logic';
import { redisSessionClient } from '@m-cafe-app/backend-logic/build/config';
import config from '@m-cafe-app/backend-logic';


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