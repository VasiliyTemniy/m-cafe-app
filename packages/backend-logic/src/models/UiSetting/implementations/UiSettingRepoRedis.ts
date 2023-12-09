import type { UiSetting, UiSettingS } from '@m-cafe-app/models';
import type { IUiSettingSRepo } from '../interfaces';
import { RedisRepoBase } from '../../../utils';

export class UiSettingRepoRedis extends RedisRepoBase implements IUiSettingSRepo {

  async getMany(theme?: string): Promise<UiSettingS[]> {
    const uiSettingsInmem: UiSettingS[] = [];

    for await (const key of this.redisClient.scanIterator()) {
      const response = await this.redisClient.hGetAll(key);

      if (theme && response.theme !== theme)
        continue;

      uiSettingsInmem.push({
        name: response.name,
        value: response.value,
        group: response.group,
        theme: response.theme
      });
    }

    return uiSettingsInmem;
  }

  async storeMany(uiSettings: UiSetting[]): Promise<void> {
    const multi = this.redisClient.multi();

    for (const uiSetting of uiSettings) {
      multi.hSet(`${String(uiSetting.id)}`, { name: uiSetting.name, value: uiSetting.value, group: uiSetting.group, theme: uiSetting.theme });
    }

    await multi.exec();
  }

  async remove(name: string): Promise<void> {
    await this.redisClient.del(name);
  }
}