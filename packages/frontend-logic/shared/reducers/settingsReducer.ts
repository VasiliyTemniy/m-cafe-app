import type { AppDispatch } from '../store';
import type  { TFunction } from '../hooks';
import type { UiSettingDT, SafeyAny } from '@m-market-app/utils';
import type { AllowedThemes } from '@m-market-app/shared-constants';
import { ApplicationError, hasOwnProperty, isUiSettingDT } from '@m-market-app/utils';
import { createSlice } from '@reduxjs/toolkit';
import uiSettingService from '../services/uiSetting';
import { handleAxiosError } from '../../utils/errorHandler';
import { Md5 } from 'ts-md5';
import { allowedThemes } from '@m-market-app/shared-constants';


type SettingsActionSetLanguage = { payload: 'main' | 'sec' | 'alt' };

type SettingsActionParseUiSettings = {
  payload: {
    uiSettings: UiSettingDT[]
  }
};

type SettingsActionSetTheme = { payload: AllowedThemes };

/**
 * Fixed locs are unnested to uiNodes by first part until dot in loc.name
 * key: string is uiNode name
 */
export type ParsedUiSettings = {
  [key: string]: UiSettingDT[]
};

export type SettingsState = {
  dbUiSettings: UiSettingDT[],
  parsedUiSettings: ParsedUiSettings,
  parsedUiSettingsHash: string,
  theme: AllowedThemes,
  language: 'main' | 'sec' | 'alt'
};

const initialState: SettingsState = {
  dbUiSettings: [],
  parsedUiSettings: {},
  parsedUiSettingsHash: '',
  theme: 'light',
  language: 'main'
};

export const sharedSettingsSliceBase = {
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state: SettingsState, action: SettingsActionSetLanguage): SettingsState => {
      window.localStorage.setItem('marketAppLanguage', JSON.stringify(action.payload));
      return { ...state, language: action.payload };
    },
    /**
     * Reads DB ui settings, splits names to uiNodes ( like `${componentType}-${theme}-baseVariant` )
     * and parsed settings names ( like className if ends with -classNames or CSS property name if ends with -inlineCSS )
     * Filters all settings with value === 'false'
     * @example
     * So, uiSetting = { name: 'input-dark-classNames.shadowed', value: 'true' }
     * 
     * gets split to:
     * uiNode === 'input-dark-classNames',
     * uiSetting: { name: 'shadowed', value: 'true' }
     */
    parseUiSettings: (state: SettingsState, action: SettingsActionParseUiSettings): SettingsState => {
      const parsedUiSettings = {} as { [key: string]: UiSettingDT[] };
      for (const uiSetting of action.payload.uiSettings) {
        // For admin module, ui settings filter is applied before component init, not inside of a reducer to preserve falsy settings in state
        if (uiSetting.value === 'false' && !process.env.FRONTEND_MODULE_ADMIN) continue;
        const firstDotIndex = uiSetting.name.indexOf('.');
        const uiNode = uiSetting.name.slice(0, firstDotIndex);
        const uiSettingName = uiSetting.name.slice(firstDotIndex + 1);
        const parsedUiSetting = { ...uiSetting, name: uiSettingName };
        if (hasOwnProperty(parsedUiSettings, uiNode))
          parsedUiSettings[uiNode] = [ ...parsedUiSettings[uiNode], parsedUiSetting ];
        else
          parsedUiSettings[uiNode] = [ parsedUiSetting ];
      }
      const parsedUiSettingsHash = Md5.hashStr(JSON.stringify(parsedUiSettings));
      return { ...state, parsedUiSettings, parsedUiSettingsHash };
    },
    setTheme: (state: SettingsState, action: SettingsActionSetTheme): SettingsState => {
      const rootElement = document.getElementsByTagName('html')[0];
      for (const theme of allowedThemes) {
        if (rootElement.classList.contains(theme))
          rootElement.classList.remove(theme);
      }
      rootElement.classList.add(action.payload);
      window.localStorage.setItem('marketAppTheme', JSON.stringify(action.payload));
      return { ...state, theme: action.payload };
    }
  },  
};

const settingsSlice = createSlice({
  ...sharedSettingsSliceBase
});

export const { setLanguage, parseUiSettings, setTheme } = settingsSlice.actions;

export const initUiSettings = (t: TFunction) => {
  return async (dispatch: AppDispatch) => {
    try {
      const uiSettings = await uiSettingService.getUiSettings();
      if (!Array.isArray(uiSettings)) throw new ApplicationError('Server has sent wrong data', { current: uiSettings });
      for (const uiSetting of uiSettings) {
        if (!isUiSettingDT(uiSetting)) throw new ApplicationError('Server has sent wrong data', { all: uiSettings, current: uiSetting as SafeyAny });
      }
      dispatch(parseUiSettings({ uiSettings }));
    } catch (e: unknown) {
      dispatch(handleAxiosError(e, t));
    }
  };
};

export default settingsSlice.reducer;