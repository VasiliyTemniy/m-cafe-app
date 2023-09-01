import { ApplicationError, isUiSettingDT, SafeyAny, UiSettingDT } from '@m-cafe-app/utils';
import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../store';
import uiSettingService from '../services/uiSetting';
import { handleAxiosError } from '../../utils/errorHandler';
import { TFunction } from '../hooks';


type SettingsActionSetLanguage = { payload: { language: 'main' | 'sec' | 'alt' } };

type SettingsActionSetUiSettings = { payload: { uiSettings: UiSettingDT[] } };

type SettingsActionSetTheme = { payload: { theme: 'dark' | 'light' } };


export type SettingsState = {
  uiSettings: {
    [key: string]: UiSettingDT[]
  },
  theme: 'dark' | 'light',
  language: 'main' | 'sec' | 'alt'
};

const initialState: SettingsState = { uiSettings: {}, theme: 'light', language: 'main' };

export const sharedSettingsSliceBase = {
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state: SettingsState, action: SettingsActionSetLanguage): SettingsState => {
      return { ...state, language: action.payload.language };
    },
    setUiSettings: (state: SettingsState, action: SettingsActionSetUiSettings): SettingsState => {
      const newUiSettingsState = {} as { [key: string]: UiSettingDT[] };
      for (const uiSetting of action.payload.uiSettings) {
        const namespace = uiSetting.name.split('.')[0];
        newUiSettingsState[namespace].push(uiSetting);
      }
      return { ...state, uiSettings: newUiSettingsState };
    },
    setTheme: (state: SettingsState, action: SettingsActionSetTheme): SettingsState => {
      return { ...state, theme: action.payload.theme };
    }
  },  
};

const settingsSlice = createSlice({
  ...sharedSettingsSliceBase
});

export const { setLanguage, setUiSettings, setTheme } = settingsSlice.actions;

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