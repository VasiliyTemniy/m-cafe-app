import { isLocStringDTN, type FixedLoc, type FixedLocDT, type FixedLocDTN, type FixedLocDTS, type LocStringDTN } from '@m-cafe-app/models';
import type { IFixedLocService, IFixedLocRepo, IFixedLocSRepo } from '../interfaces';
import { ApplicationError, isString } from '@m-cafe-app/utils';
import { FixedLocMapper } from '../infrastructure';
import { logger } from '@m-cafe-app/utils';
import { getFileReadPromises } from '../../../utils';
import type { FixedLocsScope } from '@m-cafe-app/shared-constants';

export class FixedLocService implements IFixedLocService {

  private locKeys = ['mainStr', 'secStr', 'altStr'];
  private initialFixedLocsPath: string = '';
  private initialFixedLocsExt: 'json' | 'jsonc' = 'jsonc';

  constructor(
    readonly dbRepo: IFixedLocRepo,
    readonly inmemRepo: IFixedLocSRepo
  ) {}

  async getAll(): Promise<FixedLocDT[]> {
    const fixedLocs = await this.dbRepo.getAll();

    return fixedLocs.map(fixedLoc => FixedLocMapper.domainToDT(fixedLoc));
  }

  async getById(id: number): Promise<FixedLocDT> {
    const fixedLoc = await this.dbRepo.getById(id);

    return FixedLocMapper.domainToDT(fixedLoc);
  }

  async getByScope(scope: string = 'defaultScope'): Promise<FixedLocDT[]> {
    const fixedLocs = await this.dbRepo.getByScope(scope);

    return fixedLocs.map(fixedLoc => FixedLocMapper.domainToDT(fixedLoc));
  }

  async create(fixedLocDTN: FixedLocDTN): Promise<FixedLocDT> {

    // CHECK if this is needed at all

    const savedFixedLoc = await this.dbRepo.create(fixedLocDTN);

    await this.storeToInmem([savedFixedLoc]);
    
    return FixedLocMapper.domainToDT(savedFixedLoc);
  }

  async update(fixedLocDT: FixedLocDT): Promise<FixedLocDT> {
    const updatedFixedLoc = await this.dbRepo.update(FixedLocMapper.dtToDomain(fixedLocDT));

    await this.storeToInmem([updatedFixedLoc]);
    
    return FixedLocMapper.domainToDT(updatedFixedLoc);
  }

  async updateMany(fixedLocsDT: FixedLocDT[]): Promise<FixedLocDT[]> {
    if (!this.dbRepo.updateMany) throw new ApplicationError(`Update many method not implemented for repository ${this.dbRepo.constructor.name}`);
    const domainFixedLocs = fixedLocsDT.map(fixedLocDT => FixedLocMapper.dtToDomain(fixedLocDT));
    const updatedFixedLocs = await this.dbRepo.updateMany(domainFixedLocs);

    await this.storeToInmem(updatedFixedLocs);

    return updatedFixedLocs.map(fixedLoc => FixedLocMapper.domainToDT(fixedLoc));
  }

  async remove(id: number): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    const removed = await this.dbRepo.remove(id);
    if (removed && removed.name)
      await this.inmemRepo.remove(removed.name);
  }

  async removeAll(): Promise<void> {
    if (process.env.NODE_ENV !== 'test') return;
    await this.dbRepo.removeAll();
    await this.inmemRepo.removeAll();
  }

  /**
   * Look for all jsonc files in path folder\
   * Then function parseLocTree:\
   * Restructure every endpoint's collected tNodes as fixedLoc.name\
   * Add to DB as fixedLocs if not exists\
   * Also caches data to inmem
   */
  async initFixedLocs(path: string, ext: 'jsonc' | 'json'): Promise<void> {

    this.initialFixedLocsPath = path;
    this.initialFixedLocsExt = ext;

    try {
      const fileReadResults = await getFileReadPromises(path, ext);
    
      for (const fileReadResult of fileReadResults) {
    
        // Strip JSONC comments
        const strippedFromCommentsFileReadResult = ext === 'jsonc'
          ? fileReadResult.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? '' : m)
          : fileReadResult;
    
        const fixedLocTree = JSON.parse(strippedFromCommentsFileReadResult) as JSON;
        await this.parseLocTree(fixedLocTree);
      }
    
    } catch (error) {
      logger.error(error);
    }

    await this.storeToInmem(await this.dbRepo.getAll());
    logger.info('Fixed locs initialized');
  }

  private isTNodeObj(obj: unknown): obj is { [key:string] : unknown } {
    if (!obj || !(typeof obj === 'object')) return false;
    for (const key in obj) {
      if (!isString(key)) return false;
    }
    return true;
  }

  private async parseLocTree(locTree: JSON) {
    try {
      const namespace = locTree['ns' as keyof JSON] as string;
      const scope = locTree['sc' as keyof JSON] as FixedLocsScope;
      if (!isString(namespace) || !isString(scope)) throw new ApplicationError('Wrong locales structure! No namespace or scope found. Check locales', { current: locTree });
  
      for (const key in locTree) {
        if (key === 'ns' || key === 'sc') continue;
        const tNodeObj = locTree[key as keyof JSON];
        if (!this.isTNodeObj(tNodeObj)) throw new ApplicationError('Wrong locales structure! Check locales', { current: locTree });
        await this.parseTNodeTree(tNodeObj, key, namespace, scope);
      }
    } catch (error) {
      logger.error(error);
      throw new ApplicationError('Wrong locales structure! Check locales', { current: locTree });
    }
  }

  private async parseTNodeTree(
    tNodeParent: { [key:string] : unknown },
    tNodePath: string,
    namespace: string,
    scope: FixedLocsScope
  ) {
    for (const key in tNodeParent) {
    
      // If found locKey as mainStr, secStr, altStr then append foundFixedLocs
      if (this.locKeys.includes(key)) {
        if (!isLocStringDTN(tNodeParent)) throw new ApplicationError('Wrong locales structure! Check locales', { current: tNodeParent });
        await this.createIfNotExists(tNodePath, tNodeParent, namespace, scope);
        // Break here means continue for parent of tNodeParent
        break;
      } else {
        const tNodeChild = tNodeParent[key];
        if (!this.isTNodeObj(tNodeChild)) throw new ApplicationError('Wrong JSON format! Check locales', { current: tNodeParent });
        await this.parseTNodeTree(tNodeChild, tNodePath + '.' + key, namespace, scope);
      }
    }
  }

  private async createIfNotExists(tNodePath: string, locString: LocStringDTN, namespace: string, scope: FixedLocsScope) {
    const foundFixedLoc = await this.dbRepo.getByUniqueProperties({ name: tNodePath, namespace, scope });
    
    if (!foundFixedLoc) {
      await this.dbRepo.create({
        name: tNodePath,
        namespace,
        scope,
        locString
      });
    }
  }

  async reset(): Promise<FixedLocDT[]> {
    await this.dbRepo.removeAll();
    await this.initFixedLocs(this.initialFixedLocsPath, this.initialFixedLocsExt);
    return await this.getAll();
  }

  /**
   * Retrieves all FixedLocDTS objects from the in-memory repository.
   *
   * @param {string[]} scopes - The scopes to filter the FixedLocDTS objects by. Optional.
   * @return {Promise<FixedLocDTS[]>} An array of FixedLocDTS objects that match the specified scopes,
   * or all FixedLocDTS objects if no scopes are specified.
   */
  async getFromInmem(scopes?: string[]): Promise<FixedLocDTS[]> {
    return await this.inmemRepo.getMany(scopes);
  }

  /**
   * Stores all the provided `fixedLocs` in memory for fast access for non-admin users.
   *
   * @param {FixedLoc[]} fixedLocs - An array of `FixedLoc` objects to be filtered and stored.
   * @return {Promise<void>} A promise that resolves when the operation is complete.
   */
  async storeToInmem(fixedLocs: FixedLoc[]): Promise<void> {
    // const nonFalsyFixedLocs = fixedLocs.filter(fixedLoc => fixedLoc.value !== 'false');
    await this.inmemRepo.storeMany(fixedLocs);
  }

  async flushInmem(): Promise<void> {
    await this.inmemRepo.removeAll();
  }

  async connectInmem(): Promise<void> {
    await this.inmemRepo.connect();
  }

  async pingInmem(): Promise<void> {
    await this.inmemRepo.ping();
  }

  async closeInmem(): Promise<void> {
    await this.inmemRepo.close();
  }

}