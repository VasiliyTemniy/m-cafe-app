import type { UiSetting, UiSettingS } from '@m-cafe-app/models';
import type { IUiSettingSRepo } from '../interfaces';
import { logger } from '@m-cafe-app/utils';
import { redisUiSettingsClient } from '../../../config';

export class UiSettingRepoSequelizePG implements IUiSettingSRepo {

  async getAllThemed(theme?: string): Promise<UiSettingS[]> {
    const uiSettingsInmem: UiSettingS[] = [];

    for await (const key of redisUiSettingsClient.scanIterator()) {
      const response = await redisUiSettingsClient.hGetAll(key);

      if (theme && response.theme !== theme)
        continue;

      uiSettingsInmem.push({
        name: key,
        value: response.value,
        group: response.group,
        theme: response.theme
      });
    }

    return uiSettingsInmem;
  }

  async storeAll(uiSettings: UiSetting[]): Promise<void> {
    const multi = redisUiSettingsClient.multi();

    for (const uiSetting of uiSettings) {
      multi.hSet(`${uiSetting.name}`, { value: uiSetting.value, group: uiSetting.group, theme: uiSetting.theme });
    }

    await multi.exec();
  }

  async removeAll(): Promise<void> {
    await redisUiSettingsClient.flushDb();
  }

  async connect(): Promise<void> {
    try {
      await redisUiSettingsClient.connect();
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
      await redisUiSettingsClient.ping();
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
    await redisUiSettingsClient.quit();
  }

}