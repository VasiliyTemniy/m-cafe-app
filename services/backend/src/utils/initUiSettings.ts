import { UiSetting } from '@m-cafe-app/db';
import logger from './logger.js';
import {
  allowedCSSPropertiesKeys,
  allowedClassNamesUiSettingsReadonly,
  allowedThemesReadonly,
  componentGroupsReadonly,
  specificUiSettingsReadonly,
  uiSettingTypesReadonly
} from '@m-cafe-app/shared-constants';

/**
 * Initializes the UI settings by iterating through the component groups,
 * themes, and UI setting types. For each UI setting type, it performs
 * different actions. It adds UI settings to the database based on the
 * UI setting type, component group, and theme.
 *
 * @return {Promise<void>} Promise that resolves once all the UI settings are added to the database
 */
export const initUiSettings = async () => {

  for (const theme of allowedThemesReadonly) {
    for (const componentGroup of componentGroupsReadonly) {
      for (const uiSettingType of uiSettingTypesReadonly) {

        switch (uiSettingType) {
          case 'classNames':
            for (const className of allowedClassNamesUiSettingsReadonly) {
              await addUiSettingToDB(className, 'false', componentGroup, theme);
            }
            break;
          case 'specific':
            break;
          case 'baseVariant':
            await addUiSettingToDB('baseVariant', 'alpha', componentGroup, theme);
            break;
          case 'baseColorVariant':
            await addUiSettingToDB('baseColorVariant', 'alpha-color', componentGroup, theme);
            break;
          case 'inlineCSS':
            for (const inlineCSSKey of allowedCSSPropertiesKeys) {
              await addUiSettingToDB(inlineCSSKey, 'false', componentGroup, theme);
            }
            break;
          default:
            logger.shout('Wrong ui setting type! Check ui settings. Setting ignored', uiSettingType);
            continue;
        }
      }
    }

    try {
      for (const componentGroup in specificUiSettingsReadonly) {
        const specificUiSetting = specificUiSettingsReadonly[componentGroup as keyof typeof specificUiSettingsReadonly];
        for (const specificUiSettingKey in specificUiSetting) {
          const value = specificUiSetting[specificUiSettingKey as keyof typeof specificUiSetting];
          await addUiSettingToDB(specificUiSettingKey, value, componentGroup, theme);
        }
      }
    } catch (error) {
      logger.shout('Error adding specific UI settings to database. Check componentGroup name in specificUiSettingsReadonly', error);
    }
  }
};

/**
 * Adds a UI setting to the database if it is not already there
 *
 * @param {string} name - The name of the UI setting.
 * @param {string} value - The value of the UI setting.
 * @param {string} group - The group of the UI setting.
 * @param {string} theme - The theme of the UI setting.
 */
const addUiSettingToDB = async (name: string, value: string, group: string, theme: string) => {
  const foundUiSetting = await UiSetting.findOne({ where: { name, group, theme } });

  if (!foundUiSetting) {
    await UiSetting.create({
      name,
      value,
      group,
      theme
    });
  }
};