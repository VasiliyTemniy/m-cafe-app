import type { FixedLoc, FixedLocS } from '@m-cafe-app/models';
import type { IFixedLocSRepo } from '../interfaces';
import { RedisRepoBase } from '../../../utils';
import { fixedLocFilter, fixedLocsScopesReadonly } from '@m-cafe-app/shared-constants';

export class FixedLocRepoRedis extends RedisRepoBase implements IFixedLocSRepo  {

  private inmemFilter: string = fixedLocFilter;

  async getMany(scopes?: string[]): Promise<FixedLocS[]> {
    let fixedLocsInmem: FixedLocS[] = [];

    if (scopes && scopes.length > 0) {
      for (const scope of scopes) {
        const scopedFixedLocs = await this.getByScope(scope);
        fixedLocsInmem = fixedLocsInmem.concat(scopedFixedLocs);
      }
    } else {
      for (const scope of fixedLocsScopesReadonly) {
        const scopedFixedLocs = await this.getByScope(scope);
        fixedLocsInmem = fixedLocsInmem.concat(scopedFixedLocs);
      }
    }

    return fixedLocsInmem;
  }

  private async getByScope(scope: string): Promise<FixedLocS[]> {
    const fixedLocsInmem: FixedLocS[] = [];

    const keys = await this.redisClient.keys(`${scope}:*`);

    for (const key of keys) {
      const result = await this.redisClient.hGetAll(key);
      
      fixedLocsInmem.push({
        name: result.name,
        namespace: result.namespace,
        scope,
        locString: {
          mainStr: result.mainStr,
          secStr: result.secStr === this.inmemFilter ? undefined : result.secStr,
          altStr: result.altStr === this.inmemFilter ? undefined : result.altStr
        }
      });
    }

    return fixedLocsInmem;
  }

  async storeMany(fixedLocs: FixedLoc[]): Promise<void> {
    const multi = this.redisClient.multi();

    for (const fixedLoc of fixedLocs) {
      multi.hSet(`${fixedLoc.scope}:${fixedLoc.namespace}:${fixedLoc.name}`, {
        name: fixedLoc.name,
        namespace: fixedLoc.namespace,
        // scope: fixedLoc.scope, // Scope is easily inferred from the key
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