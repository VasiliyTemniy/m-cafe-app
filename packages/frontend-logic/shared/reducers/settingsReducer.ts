import type { AppDispatch } from '../store';
import type  { TFunction } from '../hooks';
import type { UiSettingDT, SafeyAny } from '@m-cafe-app/utils';
import type { AllowedThemes } from '@m-cafe-app/shared-constants';
import { ApplicationError, hasOwnProperty, isUiSettingDT } from '@m-cafe-app/utils';
import { createSlice } from '@reduxjs/toolkit';
import uiSettingService from '../services/uiSetting';
import { handleAxiosError } from '../../utils/errorHandler';
import { Md5 } from 'ts-md5';
import { allowedThemes } from '@m-cafe-app/shared-constants';


type SettingsActionSetLanguage = { payload: 'main' | 'sec' | 'alt' };

type SettingsActionSetUiSettings = { payload: { uiSettings: UiSettingDT[] } };

type SettingsActionSetTheme = { payload: AllowedThemes };


export type SettingsState = {
  dbUiSettings: UiSettingDT[],
  actualUiSettings: {
    [key: string]: UiSettingDT[]
  },
  uiSettingsHash: string,
  theme: AllowedThemes,
  language: 'main' | 'sec' | 'alt'
};

const initialState: SettingsState = {
  dbUiSettings: [],
  actualUiSettings: {},
  uiSettingsHash: '',
  theme: 'light',
  language: 'main'
};

export const sharedSettingsSliceBase = {
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state: SettingsState, action: SettingsActionSetLanguage): SettingsState => {
      return { ...state, language: action.payload };
    },
    setUiSettings: (state: SettingsState, action: SettingsActionSetUiSettings): SettingsState => {
      return { ...state, dbUiSettings: action.payload.uiSettings };
    },
    /**
     * Reads DB ui settings, splits names to namespaces ( like `${componentType}-${theme}-baseVariant` )
     * and actual settings names ( like className if ends with -classNames or CSS property name if ends with -inlineCSS )
     * Filters all settings with value === 'false'
     * @example
     * So, uiSetting = { name: 'input-dark-classNames.shadowed', value: 'true' }
     * 
     * gets split to:
     * namespace === 'input-dark-classNames',
     * uiSetting: { name: 'shadowed', value: 'true' }
     */
    parseUiSettings: (state: SettingsState, action: SettingsActionSetUiSettings): SettingsState => {
      const newUiSettingsState = {} as { [key: string]: UiSettingDT[] };
      for (const uiSetting of action.payload.uiSettings) {
        if (uiSetting.value === 'false') continue;
        const nameParts = uiSetting.name.split('.');
        const namespace = nameParts[0];
        const uiSettingName = nameParts[1] ? nameParts[1] : '';
        const actualUiSetting = { ...uiSetting, name: uiSettingName };
        if (hasOwnProperty(newUiSettingsState, namespace))
          newUiSettingsState[namespace] = [ ...newUiSettingsState[namespace], actualUiSetting ];
        else
          newUiSettingsState[namespace] = [ actualUiSetting ];
      }
      const uiSettingsHash = Md5.hashStr(JSON.stringify(newUiSettingsState));
      return { ...state, actualUiSettings: newUiSettingsState, uiSettingsHash };
    },
    setTheme: (state: SettingsState, action: SettingsActionSetTheme): SettingsState => {
      const rootElement = document.getElementsByTagName('html')[0];
      for (const theme of allowedThemes) {
        if (rootElement.classList.contains(theme))
          rootElement.classList.remove(theme);
      }
      rootElement.classList.add(action.payload);
      window.localStorage.setItem('CafeAppTheme', JSON.stringify(action.payload));
      return { ...state, theme: action.payload };
    }
  },  
};

const settingsSlice = createSlice({
  ...sharedSettingsSliceBase
});

export const { setLanguage, setUiSettings, parseUiSettings, setTheme } = settingsSlice.actions;

export const initUiSettings = (t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const uiSettings = await uiSettingService.getUiSettings();
      if (!Array.isArray(uiSettings)) throw new ApplicationError('Server has sent wrong data', { current: uiSettings });
      for (const uiSetting of uiSettings) {
        if (!isUiSettingDT(uiSetting)) throw new ApplicationError('Server has sent wrong data', { all: uiSettings, current: uiSetting as SafeyAny });
      }
      dispatch(setUiSettings({ uiSettings }));
      dispatch(parseUiSettings({ uiSettings }));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export default settingsSlice.reducer;