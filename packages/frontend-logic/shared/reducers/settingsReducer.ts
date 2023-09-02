import { ApplicationError, isUiSettingDT, SafeyAny, UiSettingDT } from '@m-cafe-app/utils';
import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import uiSettingService from '../services/uiSetting';
import { handleAxiosError } from '../../utils/errorHandler';
import { TFunction } from '../hooks';
import { Md5 } from 'ts-md5';


type SettingsActionSetLanguage = { payload: { language: 'main' | 'sec' | 'alt' } };

type SettingsActionSetUiSettings = { payload: { uiSettings: UiSettingDT[] } };

type SettingsActionSetTheme = { payload: { theme: 'dark' | 'light' } };


export type SettingsState = {
  dbUiSettings: UiSettingDT[],
  actualUiSettings: {
    [key: string]: UiSettingDT[]
  },
  uiSettingsHash: string,
  theme: 'dark' | 'light',
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
      return { ...state, language: action.payload.language };
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
        newUiSettingsState[namespace].push({ ...uiSetting, name: uiSettingName });
      }
      const uiSettingsHash = Md5.hashStr(JSON.stringify(newUiSettingsState));
      return { ...state, actualUiSettings: newUiSettingsState, uiSettingsHash };
    },
    setTheme: (state: SettingsState, action: SettingsActionSetTheme): SettingsState => {
      return { ...state, theme: action.payload.theme };
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
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export default settingsSlice.reducer;