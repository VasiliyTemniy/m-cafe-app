import type { MyRedisClientType } from '../config';
import type { IInmemRepoBase } from './IInmemRepo';
import { logger } from '@m-market-app/utils';


/**
 * Base class for all redis repositories
 * Implements (flushDb as removeAll), connect, ping, and close
 */
export class RedisRepoBase implements IInmemRepoBase {
  constructor ( readonly redisClient: MyRedisClientType ) {}

  async removeAll(): Promise<void> {
    await this.redisClient.flushDb();
  }

  async connect(): Promise<void> {
    try {
      await this.redisClient.connect();
      logger.info('connected to redis');
    } catch (err) {
      logger.error(err as string);
      logger.info('failed to connect to redis');
      if (process.env.NODE_ENV === 'production') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await this.connect();
      }
      return process.exit(1);
    }
  }

  async ping(): Promise<void> {
    try {
      await this.redisClient.ping();
    } catch (err) {
      logger.error(err as string);
      logger.info('failed to ping redis');
      if (process.env.NODE_ENV === 'production') {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await this.close();
        await this.connect();
        await this.ping();
      }
      return process.exit(1);
    }
  }

  async close(): Promise<void> {
    await this.redisClient.quit();
  }
}