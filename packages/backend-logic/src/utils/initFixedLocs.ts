import type { NewLocString } from '@m-cafe-app/utils';
import { FixedLoc, LocString } from '@m-cafe-app/db';
import { ApplicationError, isNewLocString, isString } from '@m-cafe-app/utils';
import { logger } from '@m-cafe-app/utils';
import { getFileReadPromises } from './getFileReadPromises.js';
import type { FixedLocsScope } from '@m-cafe-app/shared-constants';

/**
 * Look for all jsonc files in locales folder\
 * Restructure every endpoint's collected tNodes as fixedLoc.name\
 * Add to DB as fixedLocs if not exists
 */
export const initFixedLocs = async (path: string, ext: 'jsonc' | 'json') => {

  try {
    const fileReadResults = await getFileReadPromises(path, ext);

    for (const fileReadResult of fileReadResults) {

      // Strip JSONC comments
      const strippedFromCommentsFileReadResult = ext === 'jsonc'
        ? fileReadResult.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? '' : m)
        : fileReadResult;

      const fixedLocTree = JSON.parse(strippedFromCommentsFileReadResult) as JSON;
      await parseLocTree(fixedLocTree);
    }

  } catch (error) {
    logger.error(error);
  }
};

const parseLocTree = async (locTree: JSON) => {
  try {
    const namespace = locTree['ns' as keyof JSON] as string;
    const scope = locTree['sc' as keyof JSON] as FixedLocsScope;
    if (!isString(namespace) || !isString(scope)) throw new ApplicationError('Wrong locales structure! No namespace or scope found. Check locales', { current: locTree });

    for (const key in locTree) {
      if (key === 'ns' || key === 'sc') continue;
      const tNodeObj = locTree[key as keyof JSON];
      if (!isTNodeObj(tNodeObj)) throw new ApplicationError('Wrong locales structure! Check locales', { current: locTree });
      await parseTNodeTree(tNodeObj, key, namespace, scope);
    }
  } catch (error) {
    logger.error(error);
    throw new ApplicationError('Wrong locales structure! Check locales', { current: locTree });
  }
};

const locKeys = ['mainStr', 'secStr', 'altStr'];

type TNodeObj = {
  [key:string] : unknown
};

const isTNodeObj = (obj: unknown): obj is TNodeObj => {
  if (!obj || !(typeof obj === 'object')) return false;
  for (const key in obj) {
    if (!isString(key)) return false;
  }
  return true;
};

const parseTNodeTree = async (tNodeParent: TNodeObj, tNodePath: string, namespace: string, scope: FixedLocsScope) => {

  for (const key in tNodeParent) {

    // If found locKey as mainStr, secStr, altStr then append foundFixedLocs
    if (locKeys.includes(key)) {
      if (!isNewLocString(tNodeParent)) throw new ApplicationError('Wrong locales structure! Check locales', { current: tNodeParent });
      await addFixedLocToDB(tNodePath, tNodeParent, namespace, scope);
      // Break here means continue for parent of tNodeParent
      break;
    } else {
      const tNodeChild = tNodeParent[key];
      if (!isTNodeObj(tNodeChild)) throw new ApplicationError('Wrong JSON format! Check locales', { current: tNodeParent });
      await parseTNodeTree(tNodeChild, tNodePath + '.' + key, namespace, scope);
    }
  }
};

const addFixedLocToDB = async (tNodePath: string, locString: NewLocString, namespace: string, scope: FixedLocsScope) => {
  const foundFixedLoc = await FixedLoc.findOne({ where: { name: tNodePath, namespace, scope } });

  if (!foundFixedLoc) {
    const savedLocString = await LocString.create(locString);
    await FixedLoc.create({
      name: tNodePath,
      locStringId: savedLocString.id,
      namespace,
      scope
    });
  }
};