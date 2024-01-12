import type { UiSetting, UiSettingS } from '@m-cafe-app/models';
import type { IUiSettingSRepo } from '../interfaces';
import { RedisRepoBase } from '../../../utils';
import { allowedThemesReadonly } from '@m-cafe-app/shared-constants';

export class UiSettingRepoRedis extends RedisRepoBase implements IUiSettingSRepo {

  async getMany(theme?: string): Promise<UiSettingS[]> {
    if (theme) return this.getByTheme(theme);

    let uiSettingsInmem: UiSettingS[] = [];

    for (const theme of allowedThemesReadonly) {
      const themedUiSettings = await this.getByTheme(theme);
      uiSettingsInmem = uiSettingsInmem.concat(themedUiSettings);
    }

    return uiSettingsInmem;
  }

  private async getByTheme(theme: string): Promise<UiSettingS[]> {
    const uiSettingsInmem: UiSettingS[] = [];

    const keys = await this.redisClient.keys(`${theme}:*`);

    for (const key of keys) {
      const result = await this.redisClient.hGetAll(key);
      const group = key.split(':')[1];
  
      for (const resultKey in result) {
        uiSettingsInmem.push({
          name: resultKey,
          value: result[resultKey],
          group,
          theme
        });
      }
    }

    return uiSettingsInmem;
  }

  async storeMany(uiSettings: UiSetting[]): Promise<void> {
    const multi = this.redisClient.multi();

    for (const uiSetting of uiSettings) {
      multi.hSet(`${uiSetting.theme}:${uiSetting.group}`, uiSetting.name, uiSetting.value);
    }

    await multi.exec();
  }

  async remove(name: string): Promise<void> {
    await this.redisClient.del(name);
  }
}