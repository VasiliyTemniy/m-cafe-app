import { ExpressErrorHandler, SessionRepoRedis, SessionService, redisSessionClient } from '@m-market-app/backend-logic';


export const errorHandler = new ExpressErrorHandler(
  new SessionService(
    new SessionRepoRedis(
      redisSessionClient
    )
  )
);