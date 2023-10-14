import type { FixedLoc, FixedLocS } from '@m-cafe-app/models';
import type { IFixedLocSRepo } from '../interfaces';
import { RedisRepoBase } from '../../../utils';
import { fixedLocFilter } from '@m-cafe-app/shared-constants';

export class FixedLocRepoRedis extends RedisRepoBase implements IFixedLocSRepo  {

  private inmemFilter: string = fixedLocFilter;

  async getMany(scopes?: string[]): Promise<FixedLocS[]> {
    const fixedLocsInmem: FixedLocS[] = [];

    for await (const key of this.redisClient.scanIterator()) {
      const response = await this.redisClient.hGetAll(key);

      if (scopes && scopes.length > 0 && !scopes.includes(response.scope))
        continue;

      fixedLocsInmem.push({
        name: key,
        namespace: response.namespace,
        scope: response.scope,
        locString: {
          mainStr: response.mainStr,
          secStr: response.secStr === this.inmemFilter ? undefined : response.secStr,
          altStr: response.altStr === this.inmemFilter ? undefined : response.altStr
        }
      });
    }

    return fixedLocsInmem;
  }

  async storeMany(fixedLocs: FixedLoc[]): Promise<void> {
    const multi = this.redisClient.multi();

    for (const fixedLoc of fixedLocs) {
      multi.hSet(`${fixedLoc.name}`, {
        namespace: fixedLoc.namespace,
        scope: fixedLoc.scope,
        mainStr: fixedLoc.locString.mainStr,
        secStr: fixedLoc.locString.secStr ? fixedLoc.locString.secStr : this.inmemFilter,
        altStr: fixedLoc.locString.altStr ? fixedLoc.locString.altStr : this.inmemFilter
      });
    }

    await multi.exec();
  }

  async remove(name: string): Promise<void> {
    await this.redisClient.del(name);
  }
}