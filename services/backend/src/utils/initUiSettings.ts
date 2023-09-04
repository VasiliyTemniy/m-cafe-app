import { UiSetting } from '@m-cafe-app/db';
import { ApplicationError, isString } from '@m-cafe-app/utils';
import logger from './logger.js';
import { getFileReadPromises } from './getFileReadPromises.js';
import { allowedThemes } from '@m-cafe-app/shared-constants';

/**
 * Look for all jsonc files in initialUiSettings folder
 * 
 * Inject theme after componentType/componentName
 * 
 * Add to DB if not exists
 */
export const initUiSettings = async () => {

  try {
    const fileReadResults = await getFileReadPromises('initialUiSettings', 'jsonc');

    for (const fileReadResult of fileReadResults) {

      // Strip JSONC comments
      const strippedFromCommentsFileReadResult = fileReadResult.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? "" : m);

      const uiSettingsTree = JSON.parse(strippedFromCommentsFileReadResult) as JSON;
      await parseUiSettingsTree(uiSettingsTree);
    }

  } catch (error) {
    logger.error(error);
  }
};

const parseUiSettingsTree = async (uiSettingsTree: JSON) => {

  for (const key in uiSettingsTree) {
    const uiNodeObj = uiSettingsTree[key as keyof JSON];
    if (!isUiNodeObj(uiNodeObj)) throw new ApplicationError('Wrong ui settings structure! Check ui settings', { current: uiSettingsTree });
    await parseUiNodeTree(uiNodeObj, key);
  }

};

type UiNodeObj = {
  [key:string] : unknown
};

const isUiNodeObj = (obj: unknown): obj is UiNodeObj => {
  if (!obj || !(typeof obj === 'object')) return false;
  for (const key in obj) {
    if (!isString(key)) return false;
  }
  return true;
};

const parseUiNodeTree = async (uiNodeParent: UiNodeObj, uiNodePath: string) => {

  for (const key in uiNodeParent) {

    // If found value then append foundUiSettings
    if (key === 'value') {
      if (!isString(uiNodeParent[key])) throw new ApplicationError('Wrong ui settings structure! Check ui settings', { current: uiNodeParent });
      await addUiSettingToDB(uiNodePath, uiNodeParent[key] as string);
      // Break here means continue for parent of uiNodeParent
      break;
    } else {
      const tNodeChild = uiNodeParent[key];
      if (!isUiNodeObj(tNodeChild)) throw new ApplicationError('Wrong JSON format! Check ui settings', { current: uiNodeParent });
      await parseUiNodeTree(tNodeChild, uiNodePath + '.' + key);
    }
  }
};

const addUiSettingToDB = async (uiNodePath: string, value: string) => {

  // Apply initial values to all themes
  for (const theme of allowedThemes) {

    let uiSettingName: string = '';

    const uiNodes = uiNodePath.split('.');

    // Inject theme to upperUiNode
    const upperUiNode = uiNodes[0];
    const upperUiNodeParts = upperUiNode.split('-');
    let themedUpperUiNode: string = upperUiNodeParts[0] + '-' + theme;
    for (let i = 1; i < upperUiNodeParts.length; i++) {
      themedUpperUiNode = themedUpperUiNode + '-' + upperUiNodeParts[i];
    }

    uiSettingName = themedUpperUiNode;

    // Reassemble nodePath with injected theme
    for (let i = 1; i < uiNodes.length; i++) {
      uiSettingName = uiSettingName + '.' + uiNodes[i];
    }

    const foundUiSetting = await UiSetting.findOne({ where: { name: uiSettingName }});

    if (!foundUiSetting) {
      await UiSetting.create({
        name: uiSettingName,
        value
      });
    }
  }

};