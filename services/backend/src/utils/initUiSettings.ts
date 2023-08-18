import { UiSettingData } from '@m-cafe-app/db-models';
import { UiSetting } from '../models/index.js';

export const initUiSettings = async () => {

  const uiSettings = [] as UiSetting[];

  for (const uiSetting of initialUiSettings) {
    // No value update if found!
    const [savedUiSetting, _created] = await UiSetting.findOrCreate({
      where: { name: uiSetting.name },
      defaults: { name: uiSetting.name, value: uiSetting.value }
    });
    uiSettings.push(savedUiSetting);
  }

  return uiSettings;

};

// Will be changed and updated
const initialUiSettings: Omit<UiSettingData, 'id'>[] = [
  {
    name: 'containerShape',
    value: 'rightAngled'
  },
  {
    name: 'buttonStyle',
    value: 'alpha'
  },
  {
    name: 'inputStyle',
    value: 'alpha'
  },
];